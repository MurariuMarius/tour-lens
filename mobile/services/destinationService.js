import { getFunctions, httpsCallable } from 'firebase/functions'
import { collection, getDocs,query, where } from "firebase/firestore";
import { db } from '@/firebaseConfig';
import { destinationSearchRange } from '@/config';
import { getLocation } from '@/services/locationService';

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

const getDestinationsNearMe = async () => {
  const location = await getLocation();
  const destinations = await getDestinationsNearLocation(location.coords.latitude, location.coords.longitude);
  
  destinations.forEach(d => console.log(d.name));
  
  return destinations;
};

const getDestinationsNearLocation = async (centerLat, centerLong) => {
  const minLat = centerLat - destinationSearchRange;
  const maxLat = centerLat + destinationSearchRange;
  const minLng = centerLong - destinationSearchRange;
  const maxLng = centerLong + destinationSearchRange;

  const q = query(
    collection(db, "destinations"),
    where("latitude", ">=", minLat),
    where("latitude", "<=", maxLat),
    where("longitude", ">=", minLng),
    where("longitude", "<=", maxLng)
  );

  const querySnapshot = await getDocs(q);
  const destinations = [];

  querySnapshot.forEach((doc) => {
    destinations.push({ id: doc.id, ...doc.data() });
  });

  return destinations;
};

export {
  createDestination,
  getDestinations,
  getDestinationsNearMe,
};
