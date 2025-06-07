import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import {
  Color,
  Border,
  FontFamily,
  FontSize,
  Padding,
} from "../../GlobalStyles";
import ButtonPrimary from "../button/ButtonPrimary";
import { useNavigation, useTheme } from "@react-navigation/native";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { baseUrl, backendUrl } from "../../services/api";
import ConfirmModal from "../modal/ConfirmModal";
import SuccessModal from "../modal/SuccessModal";

const ProductShopping = ({ title, text, price, image, id }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { accessToken, isGuest } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleAddToCart = () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }

    // Add item to cart
    axios
      .post(
        `${backendUrl}/cart`,
        { itemId: id, quantity: 1 },
        { headers: { "x-access-token": accessToken } }
      )
      .then((response) => {
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        setShowErrorModal(true);
      });
  };

  const handleAuthConfirm = () => {
    setShowAuthModal(false);
    navigation.navigate("SignIn");
  };

  return (
    <View className={"w-screen items-center justify-center px-2.5"}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { ID: id })}
        style={[
          styles.frameParent,
          { backgroundColor: colors.surfaceContainerHigh },
        ]}
      >
        <View>
          <Image
            style={[styles.componentChild]}
            contentFit={"contain"}
            source={{ uri: image }}
          />
        </View>
        <View style={[styles.frameGroup]}>
          <View style={{ justifyContent: "space-between" }}>
            <Text
              numberOfLines={2}
              style={[
                styles.product,
                styles.buyNowTypo,
                { color: colors.onSurface },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.product1,
                styles.textTypo,
                { color: colors.onSurfaceVarient },
              ]}
            >
              {text}
            </Text>
            <Text
              style={[
                styles.text,
                styles.textTypo,
                { color: colors.onSurface },
              ]}
            >
              ${price}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end", marginTop: 5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 2, marginRight: 15 }}>
                <ButtonPrimary
                  text={"Buy now"}
                  buttonPrimaryPaddingVertical={10}
                  buttonPrimaryPaddingHorizontal={15}
                  buttonPrimaryBorderWidth={2}
                  onPressButton={() => {
                    navigation.navigate("Payment", { Amount: 1, Price: price });
                  }}
                  buttonPrimaryFlex={1}
                  buttonPrimaryStyle={{
                    justifyContent: "center",
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ButtonPrimary
                  buttonPrimaryBackgroundColor={"unset"}
                  buttonPrimaryPaddingVertical={10}
                  buttonPrimaryPaddingHorizontal={15}
                  buttonPrimaryBorderWidth={2}
                  onPressButton={handleAddToCart}
                  image={require("../../assets/vector2.png")}
                  buttonPrimaryFlex={1}
                  buttonPrimaryStyle={{
                    justifyContent: "center",
                  }}
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Authentication Modal */}
      <ConfirmModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConfirm={handleAuthConfirm}
        title="Authentication Required"
        message="Please sign in to add items to your cart. You'll get access to exclusive features and personalized recommendations."
        confirmText="Sign In"
        cancelText="Cancel"
        confirmColor={colors.primary}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Added to Cart"
        message={`"${title}" has been successfully added to your cart.`}
        buttonText="Continue Shopping"
      />

      {/* Error Modal */}
      <ConfirmModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
        title="Error"
        message="Failed to add item to cart. Please check your connection and try again."
        confirmText="Try Again"
        cancelText="Cancel"
        confirmColor="#FF4444"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buyNowTypo: {
    fontFamily: FontFamily.labelMediumBold,
    textAlign: "left",
  },
  textTypo: {
    marginTop: 5,
    fontFamily: FontFamily.labelMediumBold,
    // fontWeight: "700",
    textAlign: "left",
  },
  componentChild: {
    backgroundColor: Color.colorDimgray_100,
    width: Dimensions.get("screen").width / 3,
    aspectRatio: 1,
    borderRadius: Border.br_3xs,
    overflow: "hidden",
  },
  product: {
    fontSize: FontSize.labelLargeBold_size,
    color: Color.surfaceOnSurface,
  },
  product1: {
    fontSize: FontSize.labelSmallRegular_size,
  },
  text: {
    fontSize: FontSize.labelMediumBold_size,
  },
  frameGroup: {
    marginLeft: 10,
    flex: 2,
    justifyContent: "space-around",
  },
  frameParent: {
    marginTop: 10,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    borderRadius: Border.br_3xs,
    padding: Padding.p_3xs,
    flexDirection: "row",
  },
});

export default ProductShopping;
