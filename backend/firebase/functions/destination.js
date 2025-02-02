const { HttpsError, onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const FormData = require("form-data");
const fetch = require("node-fetch");
const { bucket, firestoreService } = require("./config");

const { v4: uuidv4 } = require("uuid");

const externalEndpointUrl = "https://tour-lens-ml-455665426558.europe-west4.run.app/model";

exports.createDestination = onCall(
  {
    timeoutSeconds: 540,
    memory: "2GiB",
    cpu: 4,
  },
  async (request) => {

    // TODO: Validate data

    try {
        const destination = request.data.destination;
        logger.info("Received Destination Data:", destination);

        const destinationId = uuidv4();
        const attractions = destination.attractions;

        const formData = new FormData();

        await Promise.all(attractions.map(async attraction => {
            attraction.label = uuidv4();
            
            const attractionLabel = attraction.label;
            const pictures = attraction.pictures;

            await Promise.all(pictures.map(async (picture, index) => {
              const imageBuffer = Buffer.from(picture, 'base64');
          
              if (index === 0) {
                  attraction.picture = await addFirstPictureToStorage(
                      `destinations/${destinationId}/attractions/${attractionLabel}.jpg`, 
                      imageBuffer
                  );
                  
                  logger.info(destination.attractions[0]);
              }
          
              const filename = `${attractionLabel}_${index}.jpg`;
              return formData.append('images', imageBuffer, { filename });
            }));

            delete attraction.pictures;
          
          }));

    destination.picture = destination.attractions[0].picture;

    logger.info("Started model training...");

    const fetchResponse = await fetch(externalEndpointUrl, {
      method: 'POST',
      headers: {
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!fetchResponse.ok) {
      const errorBody = await fetchResponse.text();
      console.error("Error sending images:", fetchResponse.status, errorBody);
      throw new HttpsError('internal', `Failed to send images: ${errorBody}`);
    }

    const responseData = await fetchResponse.json();

    destination.modelId = responseData.model_id;
    destination.labels = responseData.labels;
    destination.id = destinationId;

    firestoreService.collection('destinations').doc(destinationId).set(destination);
    
    logger.info("Images sent successfully:", responseData);
    return { message: "Images sent successfully", data: responseData };

  } catch (error) {
    console.error("Error processing request:", error);
    throw new HttpsError('unknown', `Failed to process request: ${error.message}`, error);
  }
});


const addFirstPictureToStorage = async (fileName, imageBuffer) => {
  const file = bucket.file(fileName);
  await file.save(imageBuffer, {
    contentType: "image/jpeg",
  });

  await file.makePublic();

  return `gs://tour-lens.firebasestorage.app/${bucket.name}/${fileName}`;
};
