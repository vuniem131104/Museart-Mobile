import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { baseUrl, backendUrl } from "../../services/api";
import axios from "axios";
import {
  FontSize,
  FontFamily,
  Color,
  Padding,
  Border,
} from "../../GlobalStyles";
import AboutTitle from "../../components/detail/content/AboutTitle";
import NavbarTop from "../../components/header/NavbarTop";
import Picture from "../../components/detail/picture/Picture";
import HTMLRender from "react-native-render-html";
import { AuthContext } from "../../context/authContext";

const ProductDetail = () => {
  const navigation = useNavigation();
  const { accessToken, isGuest } = useContext(AuthContext);

  const route = useRoute();
  const { ID } = route.params;

  const [product, setProduct] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { colors } = useTheme();

  const getProduct = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products/${ID}`);
      setProduct(response.data.data);
      console.log(ID);
      console.log(product);
    } catch (error) {
      //console.log(product);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <View
      style={[
        styles.productContainer,
        { backgroundColor: colors.surfaceContainer },
      ]}
    >
      <NavbarTop />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView style={styles.body}>
          <Picture
            imagePath={product.image_url}
            date={product.timestamp}
            altText={product.title}
            id={product.id}
            type="product"
          />
          <AboutTitle
            title={product.title}
            tagRoute="Product"
            tagDetail="Shop"
            isPrice={true}
            price={product.max_current_price}
          />
          <ScrollView style={styles.descriptioncontainer}>
            <Text style={[styles.buyNowTypo, { color: colors.onSurface }]}>
              Description
            </Text>
            <HTMLRender
              source={{ html: product.description }}
              baseStyle={{
                color: colors.onSurface,
                textAlign: "justify",
                alignSelf: "stretch",
              }}
              defaultTextProps={{
                style: {
                  fontFamily: FontFamily.typographyLabelLarge,
                },
              }}
              contentWidth={Dimensions.get("window").width}
            />

            <View style={styles.containerutilbuttons}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Payment", {
                    Amount: 1,
                    Price: product.max_current_price,
                  });
                }}
                style={[
                  styles.savebuttonSpaceBlock,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.buyNowTypo, { color: colors.onPrimary }]}>
                  Buy now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isGuest) {
                    Alert.alert(
                      "Authentication Required",
                      "Please sign in to add items to your cart",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Sign In", onPress: () => navigation.navigate("SignIn") }
                      ]
                    );
                    return;
                  }

                  // Add item to cart
                  axios.post(`${backendUrl}/cart`,
                    { itemId: product.id, quantity: 1 },
                    { headers: { 'x-access-token': accessToken } }
                  )
                  .then(response => {
                    Alert.alert("Success", "Item added to cart");
                  })
                  .catch(error => {
                    console.error("Error adding to cart:", error);
                    Alert.alert("Error", "Failed to add item to cart");
                  });
                }}
                style={[styles.savebutton, styles.savebuttonSpaceBlock]}
              >
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../../assets/vector7.png")}
                />
                <Text style={[styles.buyNowTypo, { color: colors.primary }]}>
                  Add to cart
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={{ paddingBottom: 70 }} />
        </ScrollView>
      )}
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "column",
    alignSelf: "stretch",
  },
  body: {
    // padding: Padding.p_3xs,
    flexDirection: "column",
    gap: 15,
    alignSelf: "stretch",
  },
  buyNowTypo: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.labelMediumBold,
    textAlign: "left",
  },
  savebuttonSpaceBlock: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_mini,
    borderRadius: Border.br_3xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
    gap: 15,
    flex: 1,
  },
  text: {
    fontSize: FontSize.bodyXlargeBold_size,
    fontFamily: FontFamily.typographyLabelLarge,
    textAlign: "left",
  },
  descriptioncontainer: {
    marginVertical: 15,
    alignSelf: "stretch",
  },
  vectorIcon: {
    width: 19,
    height: 19,
  },
  savebutton: {
    borderStyle: "solid",
    borderColor: Color.primaryPrimary,
    borderWidth: 2,
  },
  containerutilbuttons: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    gap: 15,
  },
});
