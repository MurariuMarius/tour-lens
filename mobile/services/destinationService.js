import { getFunctions, httpsCallable } from 'firebase/functions'
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebaseConfig';

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

const getDestinations = async () => {
    const destinations = []
    const querySnapshot = await getDocs(collection(db, "destinations"));
    querySnapshot.forEach(doc => destinations.push({ ...doc.data(), id: doc.id }));
    console.log(destinations)
    return destinations;
};

export {
    createDestination,
    getDestinations,
};
