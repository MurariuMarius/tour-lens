import express from 'express';
import FormData from 'form-data';
import fetch from 'node-fetch';

const app = express();
const port = 8080;

app.use(express.json({ limit: '50mb' })); // Allow up to 50MB JSON payload
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For URL-encoded data

app.post('/destinations', async (req, res) => {
    try {
        const destination = req.body.destination;
        console.log("Received Destination Data:", destination);

        const destinationId = destination.id;
        const attractions = destination.attractions;

        const formData = new FormData();

        attractions.forEach(attraction => {
            const attractionLabel = attraction.label;
            const pictures = attraction.pictures; // Now an array of base64 strings

            pictures.forEach((picture, index) => {
                const imageBuffer = Buffer.from(picture, 'base64'); // Convert base64 to Buffer
                const filename = `${attractionLabel}_${destinationId}_${index}.jpg`;
                formData.append('images', imageBuffer, { filename }); // Append with filename
            });
        });

    const externalEndpointUrl = "https://tour-lens-ml-455665426558.us-central1.run.app/model";

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
      return res.status(500).json({ error: `Failed to send images: ${errorBody}` });
    }

    const responseData = await fetchResponse.json();
    console.log("Images sent successfully:", responseData);
    return res.status(200).json({ message: "Images sent successfully", data: responseData });
    return res.status(200).json({})

  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});