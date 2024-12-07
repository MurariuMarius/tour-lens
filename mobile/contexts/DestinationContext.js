import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getDestinations } from "@/services/destinationService";

const DestinationsContext = createContext({
  destinations: [],
  isLoading: true,
  error: null,
  refresh: () => {},
});

export const useDestinations = () => useContext(DestinationsContext);

export const DestinationsProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
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
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const value = { destinations, isLoading, error, refresh };

  return (
    <DestinationsContext.Provider value={value}>
      {children}
    </DestinationsContext.Provider>
  );
};