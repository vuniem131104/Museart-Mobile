import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const baseUrl = 'https://api.artic.edu/api/v1';

// IMPORTANT: Set the backend IP address to your computer's actual IP address
// For mobile app to connect to your backend, this must be reachable from your device
const BACKEND_IP = '192.168.1.11'; // Change this to your computer's IP address
const API_PORT = 3000;

// Check if we're running in Expo development and if there's a proxy setting
const getApiBaseUrl = () => {
  // For web environment
  if (Platform.OS === 'web') {
    return `http://${BACKEND_IP}:${API_PORT}`;
  }
  
  // For iOS simulator which can access localhost
  if (Platform.OS === 'ios' && !__DEV__) {
    return `http://localhost:${API_PORT}`;
  }
  
  // For Android and iOS devices, use the IP address
  return `http://${BACKEND_IP}:${API_PORT}`;
};

// Expo URLs
export const localhost = 'exp://0vijary-anonymous-8081.exp.direct';

// Backend API URL based on environment
const apiBaseUrl = getApiBaseUrl();
export const backendUrl = `${apiBaseUrl}/api`;

// For troubleshooting connection issues
export const getConnectionInfo = () => {
  return {
    backendUrl,
    platform: Platform.OS,
    isDev: __DEV__,
    ip: BACKEND_IP,
    port: API_PORT
  };
};