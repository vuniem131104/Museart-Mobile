import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Image, Modal, Pressable, Alert, ActivityIndicator } from "react-native";
import { Color, Border, Padding, FontSize, FontFamily } from "../../GlobalStyles";
import NavbarTop from "../../components/header/NavbarTop";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import NotificationSuccess from "../../components/notification/NotificationSuccess";
import NotificationFailed from "../../components/notification/NotificationFailed";
import VNPayWebView from "../../components/payment/VNPayWebView";
import axios from "axios";
import { backendUrl } from "../../services/api";
import { AuthContext } from "../../context/authContext";

const Payment = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();
    const { accessToken } = useContext(AuthContext);

    const { Amount, Price } = route.params;
    const [ name, setName ] = useState("");
    const [ numberPhone, setNumberPhone ] = useState("");
    const [ ward, setWard ] = useState("");
    const [ province, setProvince ] = useState("");
    const [ address, setAddress ] = useState("");
    const [ payMethod, setPayMethod ] = useState(0);
    const [ success, setSuccess ] = useState(0);
    const [ showVNPay, setShowVNPay ] = useState(false);
    const [ vnpayUrl, setVnpayUrl ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);

    const checkValid = () => {
        return name != "" && numberPhone != "" && ward != "" && province != "" && address != "" && payMethod != 0;
    }

    const handleVNPayPayment = async () => {
        if (!checkValid()) {
            setSuccess(-1);
            return;
        }

        setIsLoading(true);
        try {
            console.log("Making payment request to:", `${backendUrl}/payment/create-payment`);
            console.log("With access token:", accessToken ? "Token exists" : "No token");

            // Create payment URL - amount is fixed at 10,000 VND on the server
            const response = await axios.post(
                `${backendUrl}/payment/create-payment`,
                {
                    amount: 5000, // This value is fixed on the server
                    orderInfo: `Payment for ${Amount} items`,
                    returnUrl: `${backendUrl}/payment/vnpay-return`
                },
                {
                    headers: { 'x-access-token': accessToken },
                    timeout: 10000 // 10 second timeout
                }
            );

            console.log("Payment response:", response.data);

            if (response.data && response.data.paymentUrl) {
                setVnpayUrl(response.data.paymentUrl);
                setShowVNPay(true);
            } else {
                Alert.alert("Error", "Failed to generate payment URL");
            }
        } catch (error) {
            console.error("Error creating VNPay payment:", error);

            // More detailed error message
            let errorMessage = "Failed to initiate payment";
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`;
                console.log("Error response data:", error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = "No response from server. Please check your network connection.";
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = `Request error: ${error.message}`;
            }

            Alert.alert("Payment Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePaymentComplete = (isSuccessful, message) => {
        setShowVNPay(false);
        setSuccess(isSuccessful ? 1 : -1);
    }
    return (
        <View style={[ styles.paymentContainer, { backgroundColor: colors.surfaceContainer } ]}>
            <NavbarTop />
            <View style={{ padding: 10, justifyContent: "center", alignSelf: "stretch" }}>
                <View style={styles.dashboardtitleFlexBox}>
                    <Text style={[ styles.headline, { color: colors.onSurface } ]}>Payment</Text>
                </View>
                <View style={[ styles.totalContainer, { backgroundColor: colors.surfaceContainerHigh, shadowColor: colors.primaryShadow } ]}>
                    <View style={{ marginBottom: 15 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={styles.text2}>Number of products</Text>
                            <Text style={[ styles.text2, { color: colors.onSurface } ]}>{Amount}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={styles.text2}>Total</Text>
                            <Text style={[ styles.text2, { color: colors.onSurface } ]}>${Price}</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={[ styles.headline, styles.headline1, { color: colors.onSurface } ]}>Information</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={[ styles.textInContainer, { backgroundColor: colors.surfaceContainerHighest } ]}>
                                <TextInput
                                    placeholder="Your Name"
                                    placeholderTextColor={colors.onSurfaceVarient}
                                    style={[ styles.textLayout, { color: colors.onSurface } ]}
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                />
                            </View>
                            <View style={[ styles.textInContainer, { backgroundColor: colors.surfaceContainerHighest }, { marginLeft: 15 } ]}>
                                <TextInput
                                    placeholder="Your Number"
                                    placeholderTextColor={colors.onSurfaceVarient}
                                    style={[ styles.textLayout, { color: colors.onSurface } ]}
                                    value={numberPhone}
                                    onChangeText={(text) => setNumberPhone(text)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={[ styles.headline, styles.headline1, { color: colors.onSurface } ]}>Address</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={[ styles.textInContainer, { backgroundColor: colors.surfaceContainerHighest } ]}>
                                <TextInput
                                    placeholder="Your Wands"
                                    placeholderTextColor={colors.onSurfaceVarient}
                                    style={[ styles.textLayout, { color: colors.onSurface } ]}
                                    value={ward}
                                    onChangeText={(text) => setWard(text)}
                                />
                            </View>
                            <View style={[ styles.textInContainer, { backgroundColor: colors.surfaceContainerHighest }, { marginLeft: 15 } ]}>
                                <TextInput
                                    placeholder="Your Province"
                                    placeholderTextColor={colors.onSurfaceVarient}
                                    style={[ styles.textLayout, { color: colors.onSurface } ]}
                                    value={province}
                                    onChangeText={(text) => setProvince(text)}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={[ styles.textInContainer, { backgroundColor: colors.surfaceContainerHighest }, { marginTop: 15 } ]}>
                                <Image source={require("../../assets/frame-83.png")} />
                                <TextInput
                                    placeholder="Your detail address"
                                    placeholderTextColor={colors.onSurfaceVarient}
                                    style={[ styles.textLayout, { color: colors.onSurface } ]}
                                    value={address}
                                    onChangeText={(text) => setAddress(text)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={[ styles.headline, styles.headline1, { color: colors.onSurface } ]}>Pay method</Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            gap: 10,
                        }}>
                            <View style={{ width: "48%" }}>
                                <ButtonPrimary
                                    image={require("../../assets/frame.png")}
                                    imageStyle={{ width: 80, height: 30, resizeMode: 'contain' }}
                                    buttonPrimaryBackgroundColor={colors.surfaceContainerHighest}
                                    buttonPrimaryBorderWidth={payMethod === 1 ? 2 : 0}
                                    buttonPrimaryPaddingVertical={15}
                                    onPressButton={() => setPayMethod(1)}
                                />
                            </View>

                            <View style={{ width: "48%" }}>
                                <ButtonPrimary
                                    image={require("../../assets/frame1.png")}
                                    imageStyle={{ width: 80, height: 30, resizeMode: 'contain' }}
                                    buttonPrimaryBackgroundColor={colors.surfaceContainerHighest}
                                    buttonPrimaryBorderWidth={payMethod === 2 ? 2 : 0}
                                    buttonPrimaryPaddingVertical={15}
                                    onPressButton={() => setPayMethod(2)}
                                />
                            </View>

                            <View style={{ width: "48%" }}>
                                <ButtonPrimary
                                    image={require("../../assets/vnpay-logo.png")}
                                    imageStyle={{ width: 80, height: 30, resizeMode: 'contain' }}
                                    buttonPrimaryBackgroundColor={colors.surfaceContainerHighest}
                                    buttonPrimaryBorderWidth={payMethod === 3 ? 2 : 0}
                                    buttonPrimaryPaddingVertical={15}
                                    onPressButton={() => setPayMethod(3)}
                                />
                            </View>

                            <View style={{ width: "48%" }}>
                                <ButtonPrimary
                                    image={require("../../assets/frame2.png")}
                                    imageStyle={{ width: 80, height: 30, resizeMode: 'contain' }}
                                    buttonPrimaryBackgroundColor={colors.surfaceContainerHighest}
                                    buttonPrimaryBorderWidth={payMethod === 4 ? 2 : 0}
                                    buttonPrimaryPaddingVertical={15}
                                    onPressButton={() => setPayMethod(4)}
                                />
                            </View>


                        </View>

                    </View>
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                            <ButtonPrimary
                                text={"Cancel"}
                                buttonPrimaryBackgroundColor={Color.primaryPrimaryFixed}
                                buttonPrimaryPaddingHorizontal={15}
                                buttonPrimaryPaddingVertical={10}
                                buttonPrimaryFlex={1}
                                onPressButton={() => navigation.goBack()}
                            />
                            <ButtonPrimary
                                text={"Pay now"}
                                buttonPrimaryFlex={1}
                                buttonPrimaryMarginLeft={15}
                                onPressButton={() => {
                                    if (payMethod === 3) {
                                        // VNPay payment
                                        handleVNPayPayment();
                                    } else {
                                        // Regular payment
                                        checkValid() ? setSuccess(1) : setSuccess(-1);
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{ marginTop: 10, textAlign: "center", color: colors.onSurface }}>By clicking Pay now, you agree to our Terms of Service and Privacy Policy</Text>
                    </View>
                </View>
                <Modal visible={success != 0} animationType="fade" transparent={true} style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000BF" }}>
                        <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={() => setSuccess(0)}>
                            {success === 1 ? <NotificationSuccess /> : <NotificationFailed />}
                        </Pressable>
                    </View>
                </Modal>

                {/* VNPay WebView Modal */}
                {showVNPay && vnpayUrl && (
                    <Modal visible={showVNPay} animationType="slide" transparent={false}>
                        <VNPayWebView
                            paymentUrl={vnpayUrl}
                            onClose={() => setShowVNPay(false)}
                            onPaymentComplete={handlePaymentComplete}
                        />
                    </Modal>
                )}
            </View>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.onSurface }]}>
                        Processing payment...
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    paymentContainer: {
        padding: 10,
        width: "100%",
        height: "100%",
        justifyContent: "flex-start",
        overflow: "hidden",
    },
    dashboardtitleFlexBox: {
        flexDirection: "row",
        alignSelf: "flex-start",
    },
    totalContainer: {
        // marginTop: ,
        marginTop: 20,
        padding: Padding.p_3xs,
        justifyContent: "flex-start",
        elevation: 10,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowRadius: 10,
        shadowOpacity: 0.5,
        borderRadius: Border.br_3xs,
    },
    headline: {
        textAlign: "left",
        fontFamily: FontFamily.labelMediumBold,
        fontSize: FontSize.headline5Bold_size,
        color: Color.surfaceOnSurface,
        fontWeight: "700",
    },
    headline1: {
        fontSize: FontSize.titleMediumBold_size,
    },
    text1: {
        fontFamily: FontFamily.typographyLabelLarge,
        fontSize: FontSize.labelLargeBold_size,
        color: Color.primaryPrimaryFixed
    },
    text2: {
        fontFamily: FontFamily.labelMediumBold,
        fontSize: FontSize.labelLargeBold_size,
        color: "black"
    },
    textInContainer: {
        flex: 1,
        alignSelf: "stretch",
        alignItems: "center",
        borderRadius: Border.br_81xl,
        flexDirection: "row",
        padding: 8,
    },
    textLayout: {
        flex: 1,
        fontSize: FontSize.labelMediumBold_size,
        fontFamily: FontFamily.typographyLabelLarge,
        color: Color.surfaceOnSurfaceVarient,
        textAlign: "left",
        marginLeft: 5,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 10,
        fontSize: FontSize.labelLargeBold_size,
        fontFamily: FontFamily.typographyLabelLarge,
        color: '#FFFFFF',
    }
})

export default Payment;