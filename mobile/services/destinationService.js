const API = "http://localhost:8080"

const createDestination = async (destination) => {
    try {
        const destinationData = {
            destination: destination
        };

        const response = await fetch(`${YOUR_EXPRESS_ENDPOINT_URL}/destinations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(destinationData),
        });

        const responseData = await response.json();
        console.log('Response:', responseData);

    } catch (error) {
        console.error('Error sending data:', error);
    }
};

export {
    createDestination,
}
