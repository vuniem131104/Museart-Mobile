import axios from 'axios';
import { backendUrl } from './api';

/**
 * Get current user profile
 * @returns {Promise} The user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${backendUrl}/user/profile`);
    
    // Ensure we're returning data in a consistent format and handle missing data gracefully
    if (!response.data) {
      console.error('Empty response from user profile API');
      return null;
    }
    
    return {
      username: response.data.username || '',
      email: response.data.email || '',
      id: response.data.id
    };
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} data - The user data to update
 * @returns {Promise} The updated user profile
 */
export const updateUserProfile = async (data) => {
  try {
    const response = await axios.put(`${backendUrl}/user/profile`, data);
    if (!response.data || !response.data.user) {
      console.error('Invalid response format from update profile API');
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error.response?.data || error.message);
    throw error;
  }
}; 