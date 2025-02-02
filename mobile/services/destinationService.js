import { getFunctions, httpsCallable } from 'firebase/functions'
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebaseConfig';

const createDestination = (destination) => {
    try {
        const destinationData = {
            destination: destination
        };
        
        const functions = getFunctions();
        const createDestination = httpsCallable(functions, 'createDestination');

        createDestination(destinationData);
    } catch (error) {
        console.error('Error sending data:', error);
    }
};

const getDestinations = async () => {
    const destinations = []
    const querySnapshot = await getDocs(collection(db, "destinations"));
    querySnapshot.forEach(doc => destinations.push({ ...doc.data(), id: doc.id }));
    return destinations;
};

export {
    createDestination,
    getDestinations,
};
