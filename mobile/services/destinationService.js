import { getFunctions, httpsCallable } from 'firebase/functions'

const createDestination = async (destination) => {
    try {
        const destinationData = {
            destination: destination
        };
        
        const functions = getFunctions();
        const createDestination = httpsCallable(functions, 'createDestination');

        const responseData = await createDestination(destinationData);
        console.log('Response:', responseData);

    } catch (error) {
        console.error('Error sending data:', error);
    }
};

export {
    createDestination,
}
