import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, Switch } from "react-native";
import { Padding, Color, FontSize, Border, FontFamily } from "../../GlobalStyles";
import ButtonPrimary from "../button/ButtonPrimary";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { getUserProfile } from "../../services/userService";

const SettingsMenu = ({ closeMenu }) => {
  const { colors } = useTheme();
  const { logout, userToken, userInfo, switchToAuthFlow } = useContext(AuthContext);
  const [userEmail, setUserEmail] = useState('');
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  const profileFetched = useRef(false);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      profileFetched.current = false;
    };
  }, []);
  
  // Fetch the latest user email from context only
  useEffect(() => {
    // First use what we have in context immediately
    if (userInfo && userInfo.email) {
      setUserEmail(userInfo.email);
    }
    
    // Only fetch the profile from API if we don't have an email in context
    // and we haven't fetched it before
    const fetchEmailIfNeeded = async () => {
      if (!userToken || profileFetched.current) return;
      
      if (!userInfo?.email) {
        try {
          profileFetched.current = true;
          const userData = await getUserProfile();
          if (userData?.email && isMounted.current) {
            setUserEmail(userData.email);
          }
        } catch (error) {
          console.error("Error loading user email in menu:", error);
        }
      }
    };
    
    fetchEmailIfNeeded();
  }, [userToken, userInfo]);
  
  const toggleSwitch = () => {
    dispatch(toggleTheme());
  };
  
  const handleNavigation = (screenName) => {
    if (closeMenu) closeMenu();
    navigation.navigate(screenName);
  };
  
  const handleLogout = async () => {
    if (closeMenu) closeMenu();
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      console.error("Menu logout error:", error);
    }
  };

  const handleGoToSignIn = () => {
    if (closeMenu) closeMenu();
    if (switchToAuthFlow) {
      switchToAuthFlow();
    }
    navigation.navigate("SignIn");
  };

  const handleGoToSignUp = () => {
    if (closeMenu) closeMenu();
    if (switchToAuthFlow) {
      switchToAuthFlow();
    }
    navigation.navigate("SignUp");
  };

  return (
    <View style={[styles.settingsMenu, {backgroundColor: colors.surfaceContainerHigh, shadowColor: colors.primaryShadow, marginTop: 0}]}>
      <MenuItem colors={colors} imageSource={isDarkMode ? require("../../assets/Explore2.png") : require("../../assets/explore.png")} text="About" />
      <MenuItem colors={colors} imageSource={isDarkMode ? require("../../assets/item.png") : require("../../assets/navbaritem.png")} text="Setting" />
      <MenuItem 
        colors={colors} 
        imageSource={isDarkMode ? require("../../assets/Frame14.png") : require("../../assets/frame-14.png")} 
        text="Cart" 
        func={() => handleNavigation("Cart")} 
      />
      <MenuItem colors={colors} isDarkMode={isDarkMode} imageSource={isDarkMode ? require("../../assets/Frame15.png") : require("../../assets/frame-141.png")} text="Feedback" />
      {userToken != null && userEmail &&
        <MenuItem colors={colors} isDarkMode={isDarkMode} imageSource={isDarkMode ? require("../../assets/Explore2.png") : require("../../assets/explore.png")} text={userEmail} />
      }
      {userToken == null ? (
        <View style={[styles.flexRow, styles.flexRowButton]}>
          <ButtonPrimary text="Sign in"
            textSize={FontSize.labelLargeBold_size}
            textMargin={8}
            buttonPrimaryFlex={1}
            onPressButton={handleGoToSignIn}
          />
          <ButtonPrimary text="Sign up"
            textSize={FontSize.labelLargeBold_size}
            buttonPrimaryBackgroundColor={colors.primaryFixed}
            buttonPrimaryMarginLeft={15}
            buttonPrimaryFlex={1}
            onPressButton={handleGoToSignUp}
          />
        </View>
      ) : (
        <View style={[styles.flexRow, styles.flexRowButton]}>
          <ButtonPrimary text="Logout"
            textSize={FontSize.labelLargeBold_size}
            textMargin={8}
            buttonPrimaryFlex={1}
            onPressButton={handleLogout}
          />
        </View>
      )}
      <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center", alignSelf: "center" }} >
        <Switch
          trackColor={{ false: '#616057', true: '#767577' }}
          thumbColor={isDarkMode ? '#f4f3f4' : '#ebe134'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>
    </View>
  );
};

const MenuItem = ({ colors, imageSource, text, func }) => {
  return (
    <Pressable onPress={func} style={[styles.menuItem, styles.flexRow]}>
      <Image style={styles.menuItemImage} source={imageSource} />
      <Text style={[styles.menuItemText, {color: colors.onSurface}]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    marginTop: 10,
  },
  menuItemImage: {
    width: 25,
    height: 25,
  },
  menuItemText: {
    marginLeft: 10,
    fontFamily: FontFamily.labelLargeMedium,
    fontSize: FontSize.labelLargeBold_size,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexRowButton: {
    paddingTop: 10,
    justifyContent: "space-between",
  },
  settingsMenu: {
    alignSelf: "flex-end",
    marginLeft: 10,
    right: 5,
    width: 237,
    padding: Padding.p_3xs,
    justifyContent: "center",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.5,
    borderRadius: Border.br_3xs,
  },
});

export default SettingsMenu;
