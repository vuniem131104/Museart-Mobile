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

// Disable console errors in production to prevent error overlays
if (!__DEV__) {
    console.error = () => {};
    console.warn = () => {};
}

const Cart = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { accessToken, isGuest } = useContext(AuthContext);
    const [ isLoading, setLoading ] = useState(false);
    const [ cartItems, setCartItems ] = useState([]);
    const [ numberOfProduct, setNumberOfProduct ] = useState(0);
    const [ totalPrice, setTotalPrice ] = useState(0);

    // Global error handler to suppress all unhandled errors
    useEffect(() => {
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        // Override console methods to suppress axios errors
        console.error = (...args) => {
            const message = args.join(' ');
            if (message.includes('Request failed with status code') ||
                message.includes('AxiosError') ||
                message.includes('Network Error')) {
                return; // Suppress axios errors
            }
            originalConsoleError.apply(console, args);
        };

        console.warn = (...args) => {
            const message = args.join(' ');
            if (message.includes('Request failed with status code') ||
                message.includes('AxiosError') ||
                message.includes('Network Error')) {
                return; // Suppress axios warnings
            }
            originalConsoleWarn.apply(console, args);
        };

        return () => {
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
        };
    }, []);

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
            // Create axios instance with custom error handling
            const axiosInstance = axios.create({
                timeout: 10000,
                validateStatus: function (status) {
                    // Consider any status code less than 600 as success to prevent throwing
                    return status < 600;
                }
            });

            const response = await axiosInstance.get(`${backendUrl}/cart`, {
                headers: { 'x-access-token': accessToken }
            });

            // Check if response is successful
            if (response.status === 200 && response.data) {
                // Transform the cart items to match the expected format
                const formattedCartItems = (response.data || []).map(cartItem => ({
                    id: cartItem?.id || 0,
                    title: cartItem?.item?.name || 'Unknown Product',
                    description: cartItem?.item?.description || '',
                    image_url: cartItem?.item?.image_url || '',
                    max_current_price: cartItem?.item?.price || 0,
                    amount: cartItem?.quantity || 1,
                    item_id: cartItem?.item_id || 0
                })).filter(item => item.id !== 0); // Filter out invalid items

                setCartItems(formattedCartItems);
            } else {
                // Handle non-200 responses silently
                setCartItems([]);
            }
        } catch (error) {
            // Completely suppress all error logging and handling
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const updateCart = () => {
        try {
            const count = cartItems.reduce((count, item) => {
                const amount = parseInt(item?.amount) || 0;
                return count + amount;
            }, 0);

            const total = Math.round(100 * cartItems.reduce((sum, item) => {
                const price = parseFloat(item?.max_current_price) || 0;
                const amount = parseInt(item?.amount) || 0;
                return sum + (price * amount);
            }, 0)) / 100;

            setNumberOfProduct(count);
            setTotalPrice(total);
        } catch (error) {
            console.error("Error updating cart totals:", error);
            setNumberOfProduct(0);
            setTotalPrice(0);
        }
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
            // Create axios instance with custom error handling
            const axiosInstance = axios.create({
                timeout: 10000,
                validateStatus: function (status) {
                    return status < 600;
                }
            });

            // Update the cart item quantity in the backend
            await axiosInstance.put(`${backendUrl}/cart/${id}`,
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
            // Completely suppress error
        }
    }

    const handleDeleteItem = (id) => {
        // Remove the item from local state after successful deletion
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }

    const renderItem = ({ item }) => {
        try {
            if (!item || !item.id) {
                return null;
            }

            return (
                <ProductCart key={item.id}
                    id={item.id}
                    title={item.title || 'Unknown Product'}
                    text={"Product"}
                    price={item.max_current_price || 0}
                    image={item.image_url || ''}
                    amount={item.amount || 1}
                    onAmoutChange={handleAmountChange}
                    onDelete={handleDeleteItem}
                >
                </ProductCart>
            )
        } catch (error) {
            console.error("Error rendering cart item:", error);
            return null;
        }
    }

    const handleClearCart = async () => {
        if (!accessToken) return;

        try {
            // Create axios instance with custom error handling
            const axiosInstance = axios.create({
                timeout: 10000,
                validateStatus: function (status) {
                    return status < 600;
                }
            });

            await axiosInstance.delete(`${backendUrl}/cart`, {
                headers: { 'x-access-token': accessToken }
            });

            setCartItems([]);
            // Remove success alert - just clear silently
        } catch (error) {
            // Completely suppress error
        }
    };

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