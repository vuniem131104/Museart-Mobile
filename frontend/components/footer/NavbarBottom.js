import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Padding, Border } from "../../GlobalStyles";
import { useTheme } from "@react-navigation/native";
import { AuthContext } from "../../context/authContext";

const NavbarBottom = ({ state, descriptors, navigation }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.navbarbottom,
        {
          backgroundColor: colors.surfaceContainer,
          shadowColor: colors.primaryShadow,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        let iconPath;
        if (route.name === "Artworks") {
          iconPath = isDarkMode
            ? require("../../assets/artworkDark.png")
            : require("../../assets/artworkicon.png");
        }
        if (route.name === "Exhibitions") {
          iconPath = isDarkMode
            ? require("../../assets/Frame32.png")
            : require("../../assets/frame-32.png");
        }
        if (route.name === "Articles") {
          iconPath = isDarkMode
            ? require("../../assets/Frame33.png")
            : require("../../assets/articleicon.png");
        }
        if (route.name === "Shopping") {
          iconPath = isDarkMode
            ? require("../../assets/Frame34.png")
            : require("../../assets/shoppingicon.png");
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.navbaritemFlexBox,
              isFocused && [
                styles.navbaritem,
                { backgroundColor: colors.surfaceContainerHighest },
              ],
            ]}
          >
            <Image
              style={styles.navbaritemChild}
              contentFit="cover"
              source={iconPath}
            />
            {isFocused ? (
              <Text
                className={"pl-1 font-interBold"}
                style={{
                  color: colors.onSurface,
                  fontFamily: "Inter-Bold",
                  marginLeft: 5,
                }}
              >
                {label}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbaritemFlexBox: {
    padding: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: Border.br_81xl,
  },
  navbaritemChild: {
    width: 30,
    height: 30,
    overflow: "hidden",
  },
  navbaritem: {
    paddingHorizontal: Padding.p_mini,
    alignItems: "center",
  },
  navbarbottom: {
    position: "absolute",
    bottom: 5,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: Border.br_81xl,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.5,
    padding: 10,
  },
});

export default NavbarBottom;
