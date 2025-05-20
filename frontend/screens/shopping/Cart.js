import React, { useState, useEffect, useContext } from "react";
import { useNavigation, useTheme } from "@react-navigation/native"
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { baseUrl, backendUrl } from "../../services/api";
import Dashboard from "../../components/header/Dashboard";
import ProductCart from "../../components/product/ProductCart";
import MyFlatList from "../../components/MyFlatList";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { Color, FontFamily, FontSize, Padding, Border } from "../../GlobalStyles";
import { AuthContext } from "../../context/authContext";

const Cart = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { accessToken, isGuest } = useContext(AuthContext);
    const [ isLoading, setLoading ] = useState(false);
    const [ cartItems, setCartItems ] = useState([]);
    const [ numberOfProduct, setNumberOfProduct ] = useState(0);
    const [ totalPrice, setTotalPrice ] = useState(0);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (isGuest) {
            Alert.alert(
                "Authentication Required",
                "Please sign in to view your cart",
                [
                    { text: "OK", onPress: () => navigation.navigate("SignIn") }
                ]
            );
        }
    }, [isGuest]);

    const getCartItems = async () => {
        if (!accessToken) return;

        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/cart`, {
                headers: { 'x-access-token': accessToken }
            });

            // Transform the cart items to match the expected format
            const formattedCartItems = response.data.map(cartItem => ({
                id: cartItem.id,
                title: cartItem.item.name,
                description: cartItem.item.description,
                image_url: cartItem.item.image_url,
                max_current_price: cartItem.item.price,
                amount: cartItem.quantity,
                item_id: cartItem.item_id
            }));

            setCartItems(formattedCartItems);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            Alert.alert("Error", "Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    const handleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const updateCart = () => {
        const count = cartItems.reduce((count, item) => count += parseInt(item.amount), 0);
        const total = Math.round(100 * cartItems.reduce((sum, item) => sum + item.max_current_price * item.amount, 0)) / 100;

        setNumberOfProduct(count);
        setTotalPrice(total);
    }

    useEffect(() => {
        if (accessToken) {
            getCartItems();
        }
    }, [accessToken]);

    useEffect(() => {
        updateCart();
    }, [cartItems]);

    const handleAmountChange = async (id, newAmount) => {
        if (!accessToken) return;

        try {
            // Update the cart item quantity in the backend
            await axios.put(`${backendUrl}/cart/${id}`,
                { quantity: newAmount },
                { headers: { 'x-access-token': accessToken } }
            );

            // Update local state
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, amount: newAmount } : item
                )
            );
        } catch (error) {
            console.error("Error updating cart item:", error);
            Alert.alert("Error", "Failed to update cart item");
        }
    }

    const renderItem = ({ item }) => {
        return (
            <ProductCart key={item.id}
                id={item.id}
                title={item.title}
                text={"Product"}
                price={item.max_current_price}
                image={item.image_url}
                amount={item.amount}
                onAmoutChange={handleAmountChange}
            >
            </ProductCart>
        )
    }

    const handleClearCart = async () => {
        if (!accessToken) return;

        try {
            await axios.delete(`${backendUrl}/cart`, {
                headers: { 'x-access-token': accessToken }
            });

            setCartItems([]);
            Alert.alert("Success", "Cart cleared successfully");
        } catch (error) {
            console.error("Error clearing cart:", error);
            Alert.alert("Error", "Failed to clear cart");
        }
    };

    // Add to the styles object
    return (
        <View style={{ flex: 1, position: 'relative' }}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <Dashboard namePage={"Carts"}>
                        <View style={{ height: "100%", }}>
                            {cartItems.length === 0 ? (
                                <View style={styles.emptyCartContainer}>
                                    <Text style={[styles.emptyCartText, { color: colors.onSurface }]}>
                                        Your cart is empty
                                    </Text>
                                    <ButtonPrimary
                                        text={"Go Shopping"}
                                        buttonPrimaryMarginTop={20}
                                        onPressButton={() => navigation.navigate("Home", {
                                            screen: "Shopping",
                                            params: { screen: "ShoppingScreen" }
                                        })}
                                    />
                                </View>
                            ) : (
                                <MyFlatList
                                    data={cartItems}
                                    renderItem={renderItem}
                                    isLoading={isLoading}
                                    handleLoading={handleLoading}
                                    renderPaginationButtons={() => <View style={{ paddingBottom: 400 }}></View>}
                                />
                            )}
                        </View>
                    </Dashboard>

                    {cartItems.length > 0 && (
                        <View style={styles.bottomWrapper}>
                            <View style={[ styles.totalContainer, { backgroundColor: colors.surfaceContainerHigh, shadowColor: colors.primaryShadow } ]}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.text1}>Number of products</Text>
                                    <Text style={[ styles.text1, { color: colors.onSurface } ]}>{numberOfProduct}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                    <Text style={styles.text2}>Total</Text>
                                    <Text style={[ styles.text2, { color: colors.onSurface } ]}>${totalPrice}</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <ButtonPrimary
                                        text={"Clear Cart"}
                                        buttonPrimaryMarginTop={30}
                                        buttonPrimaryBackgroundColor={Color.colorRed}
                                        onPressButton={handleClearCart}
                                    />
                                    <ButtonPrimary
                                        text={"Pay now"}
                                        buttonPrimaryMarginTop={30}
                                        onPressButton={() => navigation.navigate("Payment", { Amount: numberOfProduct, Price: totalPrice })}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    text1: {
        fontFamily: FontFamily.typographyLabelLarge,
        fontSize: FontSize.labelLargeBold_size,
        color: Color.primaryPrimaryFixed
    },
    text2: {
        fontFamily: FontFamily.labelMediumBold,
        fontSize: FontSize.labelLargeBold_size,
        color: Color.primaryPrimaryFixed
    },
    bottomWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        zIndex: 999,
        backgroundColor: 'transparent',
    },
    totalContainer: {
        width: "100%",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 20,
        elevation: 5,
        shadowOpacity: 0.5,
        borderRadius: Border.br_3xs,
        padding: Padding.p_3xs,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    emptyCartText: {
        fontFamily: FontFamily.typographyLabelLarge,
        fontSize: FontSize.labelLargeBold_size * 1.5,
        textAlign: "center",
    },
});

export default Cart;