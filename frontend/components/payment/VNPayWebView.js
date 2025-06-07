import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '@react-navigation/native';
import { FontFamily, FontSize } from '../../GlobalStyles';

const VNPayWebView = ({ paymentUrl, onClose, onPaymentComplete }) => {
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    // Handle navigation state changes
    const handleNavigationStateChange = (navState) => {
        // Check if the URL contains the return URL parameters
        if (navState.url.includes('vnp_ResponseCode')) {
            // Extract the response code
            const urlParams = new URLSearchParams(navState.url.split('?')[1]);
            const responseCode = urlParams.get('vnp_ResponseCode');

            // Payment successful
            if (responseCode === '00') {
                onPaymentComplete(true, 'Payment successful');
            } else {
                onPaymentComplete(false, 'Payment failed');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerContent}>
                    <Image
                        source={require('../../assets/vnpay-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <WebView
                source={{ uri: paymentUrl }}
                onNavigationStateChange={handleNavigationStateChange}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                style={styles.webView}
            />

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.onSurface }]}>
                        Loading payment page...
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    logo: {
        width: 120,
        height: 40,
    },
    headerText: {
        color: '#fff',
        fontSize: FontSize.titleMediumBold_size,
        fontFamily: FontFamily.labelMediumBold,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    webView: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loadingText: {
        marginTop: 10,
        fontSize: FontSize.labelLargeBold_size,
        fontFamily: FontFamily.typographyLabelLarge,
    },
});

export default VNPayWebView;
