import React from "react";
import { useState } from "react";
import { StyleSheet, Image, Pressable, Modal, SafeAreaView, View, StatusBar, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Border, Padding } from "../../GlobalStyles";
import { useNavigation, useTheme } from "@react-navigation/native";
import SettingsMenu from "./SettingsMenu";
import ChatbotModal from "../chatbot/ChatbotModal"; // Import the ChatbotModal component

const NavbarTop = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChatbotVisible, setChatbotVisible] = useState(false); // New state for chatbot modal

  const { colors } = useTheme();

  const onBackPress = () => {
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];
    if (navigation.canGoBack() && (prevRoute != null)) navigation.goBack();
  };

  const openMenu = () => {
    setIsModalVisible(true);
  };

  const closeMenu = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.navbartop}>
      <Pressable onPress={onBackPress} style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
        <Image
          contentFit="cover"
          source={require("../../assets/vector.png")}
        />
      </Pressable>

      <Pressable 
        onPress={() => setChatbotVisible(true)} // Open chatbot when pressed
        style={[styles.iconContainer, { marginTop: -5}]}
      >
        <Image
          contentFit="cover"
          source={require("../../assets/chatbot.png")}
          style={{ width: 38, height: 38 }}
        />
      </Pressable>
      
      <Pressable 
        onPress={openMenu} 
        style={[styles.iconContainer, { backgroundColor: colors.primary }]}
      >
        <Image
          contentFit="cover"
          source={require("../../assets/frame-45.png")}
        />
      </Pressable>
      
      {/* Settings Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <SettingsMenu closeMenu={closeMenu} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Chatbot Modal */}
      <ChatbotModal 
        visible={isChatbotVisible} 
        onClose={() => setChatbotVisible(false)} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    borderRadius: Border.br_81xl,
    padding: Padding.p_8xs,
    height: 35,
    width: 35,
  },
  navbartop: {
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 90,
    marginRight: 5,
  }
});

export default NavbarTop;