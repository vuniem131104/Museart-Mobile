import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../../context/authContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import NavbarTop from '../../components/header/NavbarTop';
import { useSelector } from 'react-redux';

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const isGuest = route.params?.isGuest;
  const { userInfo, userToken, isLoading: authLoading, updateUserInfoState } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);
  const hasFetchedProfile = useRef(false);

  console.log('Profile screen - userToken:', userToken ? 'exists' : 'null', 'isGuest:', isGuest);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      hasFetchedProfile.current = false;
    };
  }, []);

  // Redirect to SignIn if no user token is present or user is in guest mode
  useEffect(() => {
    console.log("Profile userToken check:", userToken, "isGuest:", isGuest);
    if (!userToken || isGuest) {
      console.log("No token or in guest mode - redirecting to SignIn");
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
  }, [userToken, isGuest, navigation]);

  // Fetch profile when userToken changes (e.g., after login)
  useEffect(() => {
    // Reset fetch status when token changes or becomes null
    if (!userToken) {
      hasFetchedProfile.current = false;
      setUsername(''); // Clear local state on logout
      setEmail('');
    }

    // Fetch the profile if we have a token and haven't fetched yet for this token
    if (userToken && !hasFetchedProfile.current) {
        console.log("Profile: userToken detected, fetching profile.");
        hasFetchedProfile.current = true;
        fetchUserProfile();
    } else if (userToken && hasFetchedProfile.current) {
        // Optional: If token exists but we already fetched, maybe refresh based on userInfo if needed?
        // Or rely solely on the initial fetch per token session.
        // For now, let's stick to fetching only once per token change.
        console.log("Profile: userToken present, profile already fetched for this session.");
        // If userInfo exists and differs from local state, update? This could re-introduce complexity.
        // Let's keep it simple: fetch on token change. Updates come via handleUpdateProfile.
        if (userInfo && (username !== userInfo.username || email !== userInfo.email)) {
            console.log("Profile: Context userInfo differs from local state, updating local state.");
            setUsername(userInfo.username || '');
            setEmail(userInfo.email || '');
        }
    }
  }, [userToken, userInfo]); // Depend on userToken AND userInfo now

  const fetchUserProfile = async () => {
    if (!userToken || !isMounted.current) return;

    setIsLoading(true);
    try {
      const userData = await getUserProfile();
      
      if (isMounted.current) {
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        
        // Only update context if data is different to avoid loops
        if (userData.username !== userInfo?.username || 
            userData.email !== userInfo?.email) {
          await updateUserInfoState({
            username: userData.username,
            email: userData.email
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateUserProfile({ username });
      
      // Update the user info in context after successful update
      if (response && response.user && isMounted.current) {
        await updateUserInfoState({
          username: response.user.username,
          email: response.user.email
        });
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      if (isMounted.current) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  if (isLoading || authLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.onSurface }]}>Loading...</Text>
      </View>
    );
  }

  if (!userToken) {
    return null; // Let the useEffect handle navigation
  }

  // Define gradient colors based on theme
  const gradientColors = isDarkMode 
    ? ['#1A0000', '#0A0A0A', '#000000'] // Dark theme gradient
    : ['#BE0303', '#F5F2EC', '#FFFFFF']; // Light theme gradient

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <SafeAreaView style={styles.container}>
        <NavbarTop />
        
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.onSurface }]}>My Profile</Text>
          </View>

          <View style={[styles.profileCard, { 
            backgroundColor: isDarkMode 
              ? 'rgba(40, 40, 40, 0.8)' 
              : 'rgba(240, 240, 240, 0.9)' 
          }]}>
            <View style={styles.infoContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#555' }]}>Username</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: colors.onSurface 
                  }]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor={isDarkMode ? "#999" : "#555"}
                />
              ) : (
                <Text style={[styles.value, { color: colors.onSurface }]}>{username}</Text>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#555' }]}>Email</Text>
              <Text style={[styles.value, { color: colors.onSurface }]}>{email}</Text>
              <Text style={[styles.helperText, { color: isDarkMode ? '#888' : '#777' }]}>Email cannot be changed</Text>
            </View>

            {isEditing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, {
                    backgroundColor: isDarkMode ? '#7D2E2E' : '#ffebea'
                  }]}
                  onPress={() => {
                    setIsEditing(false);
                    setUsername(userInfo?.username || '');
                  }}
                >
                  <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#d32f2f' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, {
                    backgroundColor: isDarkMode ? '#2E7D32' : '#e8f5e9'
                  }]}
                  onPress={handleUpdateProfile}
                >
                  <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#2e7d32' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.editButton, {
                  backgroundColor: colors.primary
                }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  scrollView: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: 8,
  },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Regular',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Regular',
    marginTop: 4,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  editButton: {
    backgroundColor: '#3366BB',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
});

export default Profile; 