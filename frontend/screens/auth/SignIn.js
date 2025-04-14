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

const SignIn = () => {
    const navigation = useNavigation();
    const { signin, userInfo } = useContext(AuthContext);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        if (!navigation.canGoBack() && userInfo != null) {
            navigation.navigate("Home");
        }
    }, [navigation, userInfo]);

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
                    <Text style={styles.welcomeText}>Welcome to online museum!</Text>
                    <Text style={styles.subText}>Sign in to explore all artworks from around the world.</Text>

                    <View style={styles.inputWrapper}>
                        <Image style={styles.icon} source={require("../../assets/group-19.png")} />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#ccc"
                            style={styles.input}
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

                    <Pressable onPress={() => signin(email, password)} style={styles.signInButton}>
                        <Text style={styles.signInText}>Sign in</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.guestButton}>
                        <Text style={styles.guestText}>Guest</Text>
                    </Pressable>

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
        fontFamily: "PlayfairDisplay-Bold", // Thay đổi font
    },
    content: {
        gap: 20,
    },
    welcomeText: {
        fontSize: 22,
        color: "#fff",
        fontFamily: "PlayfairDisplay-Bold", // Thay đổi font
    },
    subText: {
        fontSize: 16,
        color: "#eee",
        fontFamily: "PlayfairDisplay-Regular", // Thay đổi font
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
        fontFamily: "PlayfairDisplay-Regular", // Thay đổi font
    },
    signInButton: {
        backgroundColor: "#BE0303",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    signInText: {
        color: "white",
        fontFamily: "PlayfairDisplay-Bold", // Thay đổi font
    },
    guestButton: {
        backgroundColor: "#666",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    guestText: {
        color: "white",
        fontFamily: "PlayfairDisplay-Bold", // Thay đổi font
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 12,
    },
    footerText: {
        color: "#ccc",
        fontFamily: "PlayfairDisplay-Regular", // Thay đổi font
    },
    signUpText: {
        color: "#fff",
        fontFamily: "PlayfairDisplay-Bold", // Thay đổi font
    },
});

export default SignIn;