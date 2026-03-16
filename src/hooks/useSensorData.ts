import { useState, useEffect } from 'react';
import { SensorData } from '../types';

export const useSensorData = () => {
  const [data, setData] = useState<SensorData | null>(null);
  
  useEffect(() => {
    // Simulasi data (nanti ganti dengan WebSocket/API)
    const interval = setInterval(() => {
      setData({
        timestamp: Date.now(),
        runningPower: 250 + Math.random() * 50,
        heartRate: 150 + Math.random() * 20,
        cadence: 170,
        groundContactTime: 210,
        verticalOscillation: 8.5,
        elevation: 45,
        efficiencyIndex: 0.6
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { data };
};