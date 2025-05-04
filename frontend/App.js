import React, { useContext, useEffect, useState } from "react";
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useSelector } from "react-redux";
import store from "./store";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";

import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import Profile from "./screens/auth/Profile";
import Cart from "./screens/shopping/Cart";
import Payment from "./screens/shopping/Payment";
import { StatusBar } from "react-native";
import { AuthContext, AuthProvider } from "./context/authContext";
import HomeTabs from "./navigation/HomeTabs";
import RequireAuthentication from "./navigation/RequireAuth";
import { MyDarkTheme, MyLightTheme } from "./GlobalStyles";

const Stack = createNativeStackNavigator();

// Loading Indicator Component
const LoadingIndicator = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <ActivityIndicator size="large" color="#FFF" />
  </View>
);

const AppContent = () => {
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const { userToken, isLoading, isGuest } = useContext(AuthContext);
  
  const navigationRef = React.useRef(null);

  // Handle navigation resets based on context state
  useEffect(() => {
    if (isLoading) return; // Don't navigate until initial check is done

    if (navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute()?.name;
      console.log(`Navigation check: token=${!!userToken}, guest=${isGuest}, currentRoute=${currentRoute}`);

      if (!userToken && !isGuest) {
        // If not logged in and not guest, ensure we are on Auth stack
        if (currentRoute !== 'SignIn' && currentRoute !== 'SignUp') {
            console.log("Resetting navigation to SignIn");
            navigationRef.current.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            });
        }
      } else {
         // If logged in or guest, ensure we are on the Home stack
         if (currentRoute === 'SignIn' || currentRoute === 'SignUp') {
             console.log("Resetting navigation to Home");
             navigationRef.current.reset({
                index: 0,
                routes: [{ name: 'Home' }],
             });
         }
      }
    }
  }, [userToken, isGuest, isLoading]); // Depend on loading state as well
  
  // Show loading indicator until context is ready
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer 
      ref={navigationRef}
      theme={isDarkMode ? MyDarkTheme : MyLightTheme}
    >
      <StatusBar />
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        // Initial route determination is less critical now due to useEffect reset,
        // but can provide a slightly faster initial paint.
        // initialRouteName={userToken || isGuest ? "Home" : "SignIn"}
      >
        {userToken || isGuest ? (
          // Authenticated or Guest Stack
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeTabs}
              // Removed initialParams={{ isGuest }} - get from context now
            />
            {/* Keep other screens accessible when logged in */} 
            {userToken && !isGuest && (
              <>
                <Stack.Screen name="ProfilePage" component={Profile} />
                <Stack.Screen name="Cart" component={Cart} />
                <Stack.Screen name="Payment" component={Payment} />
              </>
            )}
          </>
        ) : (
          // Authentication Stack
          <>
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              // Removed initialParams={{ setIsGuest }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "PlayfairDisplay-Medium": require("./assets/fonts/PlayfairDisplay-Medium.ttf"),
    "PlayfairDisplay-Regular": require("./assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Bold": require("./assets/fonts/PlayfairDisplay-Bold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  } else console.log("Fonts loaded");

  // Wrap the entire AppContent with AuthProvider now
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
};

export default App;
AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);
