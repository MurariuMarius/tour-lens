import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebaseConfig';

const DestinationsContext = createContext({
  destinations: [],
  isLoading: true,
  error: null,
  refresh: (fetchStrategy) => {},
});

export const useDestinations = () => useContext(DestinationsContext);

export const DestinationsProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const processDestinations = async (destinations) => {
    await Promise.all(destinations.map(async (destination) => await processDestination(destination)));
    return destinations;
  }

  const processDestination = async (destination) => {
    try {
      if (destination.picture) {
        destination.picture = await getImageFromStorage(destination.picture);
      }

      if (destination.attractions) {
        await Promise.all(
          destination.attractions.map(async (attraction) => {
            if (attraction.picture) {
              attraction.picture = await getImageFromStorage(attraction.picture);
            }
            return attraction;
          })
        );
      }

      return destination;
    } catch (error) {
      console.error('Error processing destination:', error);
      throw error;
    }
  };

  const fetchData = useCallback(async (fetchStartegy) => {
    setIsLoading(true);
    try {
      const data = await fetchStartegy();
      const destinations = await processDestinations(data);
      setDestinations(destinations);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setDestinations([]);
      setIsLoading(false);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const refresh = useCallback((fetchStartegy) => {
    if (fetchStartegy) {
      fetchData(fetchStartegy);
    }
  }, [fetchData]);

  const value = { destinations, isLoading, error, refresh };

  return (
    <DestinationsContext.Provider value={value}>
      {children}
    </DestinationsContext.Provider>
  );
};

const convertImageToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

const getImageFromStorage = async (gsUrl) => {
  try {
    const path = gsUrl.replace('gs://', '').split('/').slice(2).join('/');
    const storageRef = ref(storage, path);
    const downloadUrl = await getDownloadURL(storageRef);
    return await convertImageToBase64(downloadUrl);
  } catch (error) {
    console.error('Error getting image from storage:', error);
    throw error;
  }
};
