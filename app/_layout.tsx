import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router'; 
import { auth } from '../firebaseConfig';  

import { onAuthStateChanged } from 'firebase/auth';


interface LayoutProps {
  children: ReactNode;  
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();  
  const [isLoading, setIsLoading] = useState(true);  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);  
      } else {
        setIsAuthenticated(false); 
        router.push('/login');  
      }
      setIsLoading(false);  
    });

    return () => unsubscribe();  
  }, [router]);

  
  if (isLoading) {
    return null;  
  }

  
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;  
}
