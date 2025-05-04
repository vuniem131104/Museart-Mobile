import * as React from "react";
import { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    Image,
    Pressable,
    TextInput,
    ScrollView,
} from "react-native";
import { Text } from "react-native"; // Giữ nguyên import Text từ react-native
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/authContext";
import { FontFamily } from "../../GlobalStyles"; // Import FontFamily
import axios from 'axios';
import { backendUrl, getConnectionInfo } from '../../services/api';

const SignIn = () => {
    const navigation = useNavigation();
    const { signin, userInfo, isLoading, enableGuestMode } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [testingConnection, setTestingConnection] = useState(false);
    // const [networkInfo, setNetworkInfo] = useState(null);

    // useEffect(() => {
    //     // Get connection info for troubleshooting
    //     setNetworkInfo(getConnectionInfo());
    // }, []);

    const handleSignIn = () => {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        signin(email, password);
    };

    const handleGuestAccess = () => {
        console.log("SignIn: Guest button pressed");
        if (enableGuestMode) {
            enableGuestMode();
        } else {
            console.error("enableGuestMode function not available in AuthContext");
        }
    };
    
    // const testConnection = async () => {
    //     setTestingConnection(true);
    //     try {
    //         console.log('Testing connection to:', `${backendUrl}/auth/test`);
    //         const result = await axios.get(`${backendUrl}/auth/test`, { timeout: 5000 });
    //         console.log('Connection test result:', result.data);
    //         alert(`Connection successful: ${JSON.stringify(result.data)}`);
    //     } catch (error) {
    //         console.log('Connection test error:', error);
    //         console.log('Connection test error message:', error.message);
    //         console.log('Connection test error code:', error.code);
    //         alert(`Connection failed: ${error.message}`);
    //     } finally {
    //         setTestingConnection(false);
    //     }
    // };

    return (
        <LinearGradient colors={['#BE0303', '#1c1a1a', '#000000']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <SafeAreaView style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        resizeMode="contain"
                        source={require("../../assets/vector8.png")}
                    />
                    <Text style={styles.appName}>Museart</Text>
                </SafeAreaView>

                <View style={styles.content}>
                    <Text style={styles.welcomeText}>Welcome to the online museum!</Text>
                    <Text style={styles.subText}>Sign in to explore artworks around the world.</Text>

                    <View style={styles.inputWrapper}>
                        <Image style={styles.icon} source={require("../../assets/group-19.png")} />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#ccc"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Image style={styles.icon} source={require("../../assets/group-20.png")} />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#ccc"
                            style={styles.input}
                        />
                    </View>

                    <Pressable 
                        onPress={handleSignIn} 
                        style={[styles.signInButton, isLoading && styles.disabledButton]}
                        disabled={isLoading}
                    >
                        <Text style={styles.signInText}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Text>
                    </Pressable>

                    <Pressable onPress={handleGuestAccess} style={styles.guestButton}>
                        <Text style={styles.guestText}>Guest</Text>
                    </Pressable>
                    
                    {/* <Pressable 
                        onPress={testConnection} 
                        style={[styles.testButton, testingConnection && styles.disabledButton]}
                        disabled={testingConnection}
                    >
                        <Text style={styles.testText}>
                            {testingConnection ? 'Testing...' : 'Test Connection'}
                        </Text>
                    </Pressable> */}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have account?</Text>
                        <Pressable onPress={() => navigation.navigate("SignUp")}>
                            <Text style={styles.signUpText}> Sign up</Text>
                        </Pressable>
                    </View>
                    
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    logo: {
        width: 80,
        height: 67,
    },
    appName: {
        fontSize: 20,
        color: "#fff",
        marginTop: 12,
        fontWeight: "bold",
        fontFamily: "Inter-Bold", // Thay đổi font
    },
    content: {
        gap: 20,
    },
    welcomeText: {
        fontSize: 22,
        color: "#fff",
        fontFamily: "Inter-Bold", // Thay đổi font
        textAlign: "center",
    },
    subText: {
        fontSize: 16,
        color: "#eee",
        fontFamily: "Inter-Regular", // Thay đổi font
        textAlign: "center",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        padding: 14,
        borderRadius: 12,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    input: {
        color: "white",
        flex: 1,
        fontSize: 16,
        fontFamily: "Inter-Regular", // Thay đổi font
    },
    signInButton: {
        backgroundColor: "#BE0303",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#882222",
        opacity: 0.7,
    },
    signInText: {
        color: "white",
        fontFamily: "Inter-Bold", // Thay đổi font
    },
    guestButton: {
        backgroundColor: "#666",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    guestText: {
        color: "white",
        fontFamily: "Inter-Bold", // Thay đổi font
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 12,
    },
    footerText: {
        color: "#ccc",
        fontFamily: "Inter-Regular", // Thay đổi font
    },
    signUpText: {
        color: "#fff",
        fontFamily: "Inter-Bold", // Thay đổi font
    },
    testButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    testText: {
        color: '#fff',
        fontSize: 16,
    },
    networkInfo: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
    },
    networkInfoText: {
        color: '#aaa',
        fontSize: 10,
        fontFamily: "Inter-Regular",
    },
});

export default SignIn;