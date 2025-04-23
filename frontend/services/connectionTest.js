import axios from 'axios';
import { backendUrl } from './api';

/**
 * Test the connection to the backend API
 * @returns {Promise} The connection test result
 */
export const testBackendConnection = async () => {
  try {
    const response = await axios.get(`${backendUrl}/auth/test`);
    console.log('Backend connection test successful:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Backend connection test failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || { message: error.message }
    };
  }
}; 