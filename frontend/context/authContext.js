import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { localhost, backendUrl } from "../services/api";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Function to update user info in context and storage
  const updateUserInfoState = async (updatedUserData) => {
    try {
      if (!updatedUserData) {
        console.log("No data provided to update user info");
        return;
      }

      if (
        userInfo &&
        userInfo.username === updatedUserData.username &&
        userInfo.email === updatedUserData.email
      ) {
        console.log("User info unchanged, skipping update");
        return;
      }

      const updatedInfo = userInfo
        ? {
            ...userInfo,
            ...updatedUserData,
          }
        : updatedUserData;

      setUserInfo(updatedInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(updatedInfo));
      console.log("User info updated in context and storage");
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
    setAccessToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    setIsGuest(true);
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/auth/signup`, {
        username,
        email,
        password,
      });
      console.log("Signup response:", res.data);

      if (res.data.user) {
        // Store tokens and user info
        await storeTokens(res.data.accessToken, res.data.refreshToken);
        setUserInfo(res.data.user);
        await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));
      } else {
        Alert.alert(
          "Signup Success",
          res.data.message || "Account created successfully!"
        );
      }
    } catch (e) {
      console.log(`sign up error:`, e.response?.data || e.message);
      Alert.alert(
        "Signup Failed",
        e.response?.data?.message ||
          "Something went wrong. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
    setIsGuest(false);
  };

  const signin = async (email, password) => {
    setLoading(true);
    try {
      console.log(
        "Attempting to sign in with URL:",
        `${backendUrl}/auth/signin`
      );

      // Add timeout to prevent hanging indefinitely
      const res = await axios.post(
        `${backendUrl}/auth/signin`,
        { email, password },
        {
          timeout: 10000, // 10 seconds timeout
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Signin response:", res.data);

      // Store tokens and user info
      await storeTokens(res.data.accessToken, res.data.refreshToken);
      setUserInfo(res.data.user);
      await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));
    } catch (e) {
      console.log(`Sign in error:`, e);

      if (e.code === "ECONNABORTED") {
        Alert.alert(
          "Connection Timeout",
          "Could not connect to the server. Please check your network connection and try again."
        );
      } else {
        Alert.alert(
          "Sign in Failed",
          e.response?.data?.message ||
            "Invalid email or password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
    setIsGuest(false);
  };

  const logout = async () => {
    console.log("Logout function called");
    setLoading(true);

    try {
      // Clear state
      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo(null);

      // Clear storage
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      // Call backend logout
      try {
        await axios.post(`${backendUrl}/auth/signout`);
      } catch (apiError) {
        console.log("Logout API error (non-critical):", apiError.message);
      }
    } catch (e) {
      console.log(`Logout error:`, e.message);
      // Final attempt to clear everything
      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo(null);
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
    setIsGuest(false);
  };

  // Helper function to store tokens
  const storeTokens = async (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    await AsyncStorage.setItem("accessToken", access);
    await AsyncStorage.setItem("refreshToken", refresh);
  };

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        // Check for new access token in response header
        const newAccessToken = response.headers["x-new-access-token"];
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          AsyncStorage.setItem("accessToken", newAccessToken);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Retry the original request with new access token
            const newAccessToken = error.response.headers["x-new-access-token"];
            if (newAccessToken) {
              originalRequest.headers["x-access-token"] = newAccessToken;
              setAccessToken(newAccessToken);
              await AsyncStorage.setItem("accessToken", newAccessToken);
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.log("Token refresh failed:", refreshError);
            // If refresh fails, logout user
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Setup request interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["x-access-token"] = accessToken;
        }
        if (refreshToken) {
          config.headers["x-refresh-token"] = refreshToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken, refreshToken]);

  // Load initial state from storage
  useEffect(() => {
    const loadInitialState = async () => {
      setLoading(true);
      try {
        const [storedAccessToken, storedRefreshToken, storedUserInfo] =
          await Promise.all([
            AsyncStorage.getItem("accessToken"),
            AsyncStorage.getItem("refreshToken"),
            AsyncStorage.getItem("userInfo"),
          ]);

        if (storedAccessToken && storedRefreshToken && storedUserInfo) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUserInfo(JSON.parse(storedUserInfo));
          setIsGuest(false);
          console.log("User session loaded from storage");
        } else {
          setIsGuest(false);
        }
      } catch (e) {
        console.log(`load user data error: ${e}`);
        setAccessToken(null);
        setRefreshToken(null);
        setUserInfo(null);
        setIsGuest(false);
      } finally {
        setLoading(false);
      }
    };
    loadInitialState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        signup,
        logout,
        updateUserInfoState,
        switchToAuthFlow,
        enableGuestMode,
        isLoading,
        userInfo,
        accessToken,
        refreshToken,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
