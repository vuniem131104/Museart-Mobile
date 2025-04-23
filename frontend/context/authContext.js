import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { localhost, backendUrl } from '../services/api';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Function to update user info in context and storage
  const updateUserInfoState = async (updatedUserData) => {
    try {
      if (!updatedUserData) {
        console.log('No data provided to update user info');
        return;
      }
      
      // If nothing changed, don't update state or storage
      if (userInfo && 
          userInfo.username === updatedUserData.username && 
          userInfo.email === updatedUserData.email) {
        console.log('User info unchanged, skipping update');
        return;
      }
      
      // If we have existing user info, merge with new data
      const updatedInfo = userInfo ? {
        ...userInfo,
        ...updatedUserData
      } : updatedUserData;
      
      setUserInfo(updatedInfo);
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      console.log('User info updated in context and storage');
    } catch (e) {
      console.log(`Error updating user info in context: ${e}`);
    }
  };

  // Function to switch from Guest mode to the Authentication flow
  const switchToAuthFlow = () => {
    console.log("Switching from Guest mode to Auth flow");
    setIsGuest(false);
    // App.js useEffect will handle navigation reset
  };

  // Function to enable guest mode
  const enableGuestMode = () => {
    console.log("Enabling Guest mode");
    setUserToken(null); // Ensure no token
    setUserInfo(null);
    setIsGuest(true);
  };

  const signup = async (username, email, password, role) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/auth/signup`, { username, email, password });
      console.log('Signup response:', res.data);
      
      if (res.data.user) {
        // Sign in automatically after successful signup
        signin(email, password);
      } else {
        Alert.alert("Signup Success", res.data.message || "Account created successfully!");
      }
    } catch (e) {
      console.log(`sign up error:`, e.response?.data || e.message);
      Alert.alert(
        "Signup Failed", 
        e.response?.data?.message || "Something went wrong. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
    setIsGuest(false);
  };

  const signin = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/auth/signin`, { email, password });
      console.log('Signin response:', res.data);
      
      const userData = {
        ...res.data.user,
        token: res.data.accessToken
      };
      
      setUserInfo(userData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      setUserToken(res.data.accessToken);
      await AsyncStorage.setItem('userToken', res.data.accessToken);
    } catch (e) {
      console.log(`sign in error:`, e.response?.data || e.message);
      Alert.alert(
        "Sign in Failed", 
        e.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
    setIsGuest(false);
  };

  const logout = async () => {
    console.log("Logout function called");
    setLoading(true);
    
    try {
      // First make sure we clear the state
      setUserToken(null);
      setUserInfo(null);
      
      // Then ensure we clear storage
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      
      // Then try to call the backend, but it's okay if this fails
      try {
        const response = await axios.post(`${backendUrl}/auth/signout`);
        console.log('Logout API response:', response.data);
      } catch (apiError) {
        console.log('Logout API error (non-critical):', apiError.message);
      }
      
      console.log('Logout successful - User token cleared');
    } catch (e) {
      console.log(`Logout error:`, e.message);
      
      // If there's any error, make another attempt to clear storage
      try {
        setUserToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('userInfo');
        await AsyncStorage.removeItem('userToken');
      } catch (finalError) {
        console.log('Final attempt to clear storage failed:', finalError.message);
      }
    } finally {
      setLoading(false);
    }

    setIsGuest(false);
  };

  // Setup axios interceptor for authenticated requests
  useEffect(() => {
    const setupAxiosInterceptor = () => {
      axios.interceptors.request.use(
        (config) => {
          if (userToken) {
            config.headers['x-access-token'] = userToken;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptor();
  }, [userToken]);

  // Check storage on mount
  useEffect(() => {
    const loadInitialState = async () => {
      setLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        
        if (storedToken && storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserToken(storedToken);
          setUserInfo(parsedUserInfo);
          setIsGuest(false); // If token exists, not a guest
          console.log('User session loaded from storage');
        } else {
          // No token found, could be first launch or logged out
          setIsGuest(false); // Default to auth flow unless explicitly entering guest mode
        }
      } catch (e) {
        console.log(`load user data error: ${e}`);
        // Ensure clean state on error
        setUserToken(null);
        setUserInfo(null);
        setIsGuest(false);
      } finally {
        setLoading(false);
      }
    };
    loadInitialState();
  }, []);

  // Log state changes for debugging
  useEffect(() => {
     console.log('Auth state changed - userToken:', userToken ? 'exists' : 'null', 'isGuest:', isGuest, 'isLoading:', isLoading);
  }, [userToken, isGuest, isLoading]);

  return (
    <AuthContext.Provider value={{ 
      signin, 
      signup, 
      logout, 
      updateUserInfoState,
      switchToAuthFlow, 
      enableGuestMode,  // Provide function to enter guest mode
      isLoading, 
      userInfo, 
      userToken,
      isGuest          // Provide guest status
    }}>
      {children}
    </AuthContext.Provider>
  );
};
