// Definisi data dari ESP32/Backend
export interface SensorData {
  timestamp: number;
  runningPower: number;      // Watt
  heartRate: number;         // BPM
  cadence: number;           // Steps per minute
  groundContactTime: number; // ms
  verticalOscillation: number; // cm
  elevation: number;         // meters
  efficiencyIndex?: number;  // HR/Power ratio
}

export interface FatigueStatus {
  level: 'normal' | 'warning' | 'critical';
  decoupling: number;        // Percentage
  message: string;
}