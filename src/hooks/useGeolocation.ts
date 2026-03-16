import { useEffect, useRef, useState } from 'react';

interface GPSData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  speed: number | null;
  altitude: number | null;
  heading: number | null;
  timestamp: number | null;
  error: string | null;
  isTracking: boolean;
}

const initialGPSData: GPSData = {
  latitude: null,
  longitude: null,
  accuracy: null,
  speed: null,
  altitude: null,
  heading: null,
  timestamp: null,
  error: null,
  isTracking: false,
};

export const useGeolocation = () => {
  const [gpsData, setGpsData] = useState<GPSData>(initialGPSData);
  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsData((prev) => ({
        ...prev,
        error: 'Geolocation tidak didukung browser ini',
      }));
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, altitude, heading } = position.coords;

        setGpsData({
          latitude,
          longitude,
          accuracy,
          speed,
          altitude,
          heading,
          timestamp: position.timestamp,
          error: null,
          isTracking: true,
        });
      },
      (error) => {
        setGpsData((prev) => ({
          ...prev,
          error: `${error.code} - ${error.message}`,
          isTracking: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setGpsData((prev) => ({
      ...prev,
      isTracking: false,
    }));
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    gpsData,
    startTracking,
    stopTracking,
  };
};