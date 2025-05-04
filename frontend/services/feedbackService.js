import axios from 'axios';
import { backendUrl } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get token from storage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
};

// Submit feedback
export const submitFeedback = async (content, rating = null) => {
  try {
    const token = await getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${backendUrl}/feedback`, 
      { content, rating },
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error.response?.data || { message: 'Failed to submit feedback' };
  }
};

// Get user's feedback (requires authentication)
export const getUserFeedback = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await axios.get(
      `${backendUrl}/feedback/user`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting user feedback:', error);
    throw error.response?.data || { message: 'Failed to fetch user feedback' };
  }
}; 