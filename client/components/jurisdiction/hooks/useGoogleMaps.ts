import { useCallback, useState } from 'react';

/**
 * Hook for loading Google Maps API script dynamically
 * Best Practice: Load script only when needed, with proper error handling
 */
export const useGoogleMaps = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoogleMapsScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded and fully initialized
      if (
        window.google && 
        window.google.maps && 
        window.google.maps.Map &&
        window.google.maps.ControlPosition
      ) {
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      );
      
      if (existingScript) {
        // Wait for existing script to load
        const checkGoogleMaps = setInterval(() => {
          if (
            window.google && 
            window.google.maps && 
            window.google.maps.Map &&
            window.google.maps.ControlPosition
          ) {
            clearInterval(checkGoogleMaps);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogleMaps);
          reject(new Error('Google Maps script load timeout'));
        }, 10000);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        reject(new Error('Google Maps API key not found'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.addEventListener('load', () => {
        // Double-check that google.maps is available
        const checkLoaded = setInterval(() => {
          if (
            window.google && 
            window.google.maps && 
            window.google.maps.Map &&
            window.google.maps.ControlPosition
          ) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 50);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          if (window.google && window.google.maps) {
            resolve();
          } else {
            reject(new Error('Google Maps not available after script load'));
          }
        }, 5000);
      });
      
      script.addEventListener('error', () => 
        reject(new Error('Failed to load Google Maps'))
      );
      
      document.head.appendChild(script);
    });
  }, []);

  return {
    loading,
    error,
    setLoading,
    setError,
    loadGoogleMapsScript
  };
};
