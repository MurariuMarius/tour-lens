const { HttpsError, onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const FormData = require("form-data");
const fetch = require("node-fetch");
const { firestoreService } = require("./config");

const { v4: uuidv4 } = require("uuid");

const externalEndpointUrl = "https://tour-lens-ml-455665426558.us-central1.run.app/model";

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
        console.log("Received Destination Data:", destination);

        const destinationId = destination.id;
        const attractions = destination.attractions;

        const formData = new FormData();

        attractions.forEach(attraction => {
            attraction.label = uuidv4();
            
            const attractionLabel = attraction.label;
            const pictures = attraction.pictures;

            pictures.forEach((picture, index) => {
                const imageBuffer = Buffer.from(picture, 'base64');
                const filename = `${attractionLabel}_${index}.jpg`;
                formData.append('images', imageBuffer, { filename });
            });
        });

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

    destination.attractions.forEach(attraction => {
      attraction.picture = attraction.pictures[0];
      delete attraction.pictures;
    })

    destination.modelId = responseData.model_id;
    destination.labels = responseData.labels;
    destination.picture = destination.attractions[0].picture;

    console.log(destination);

    firestoreService.collection('destinations').add(destination);
    
    console.log("Images sent successfully:", responseData);
    return { message: "Images sent successfully", data: responseData };

  } catch (error) {
    console.error("Error processing request:", error);
    throw new HttpsError('unknown', `Failed to process request: ${error.message}`, error);
  }
});
