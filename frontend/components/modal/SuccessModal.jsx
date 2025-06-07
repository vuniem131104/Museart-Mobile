import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { FontFamily, FontSize, Border, Padding } from "../../GlobalStyles";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

const SuccessModal = ({
  visible,
  onClose,
  title = "Success",
  message,
  buttonText = "OK",
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: opacityValue,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: colors.surface,
                  transform: [{ scale: scaleValue }],
                },
              ]}
            >
              <View style={styles.modalContent}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#4CAF50" }]}
                >
                  <Text style={styles.checkIcon}>✓</Text>
                </View>

                <Text style={[styles.title, { color: colors.onSurface }]}>
                  {title}
                </Text>

                <Text
                  style={[styles.message, { color: colors.onSurfaceVarient }]}
                >
                  {message}
                </Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={onClose}
                >
                  <Text
                    style={[styles.buttonText, { color: colors.onPrimary }]}
                  >
                    {buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: Border.br_base,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalContent: {
    padding: Padding.p_xl,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: FontSize.headlineSmall_size,
    fontFamily: FontFamily.labelMediumBold,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: FontSize.bodyMedium_size,
    fontFamily: FontFamily.typographyLabelLarge,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  buttonText: {
    fontSize: FontSize.labelLarge_size,
    fontFamily: FontFamily.labelMediumBold,
    fontWeight: "500",
  },
});

export default SuccessModal;
