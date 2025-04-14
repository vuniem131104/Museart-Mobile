import * as React from "react";
import { useState, useContext, useEffect } from "react";
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    Pressable,
    TextInput,
    SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/authContext";

const SignUp = () => {
    const navigation = useNavigation();
    const { signup, userInfo } = useContext(AuthContext);
    const [username, setUsername] = useState(null);
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
                        source={require("../../assets/vector9.png")}
                    />
                    <Text style={styles.appName}>Museart</Text>
                </SafeAreaView>

                <View style={styles.content}>
                    <Text style={styles.title}>Let's start!</Text>
                    <Text style={styles.subText}>Create a new account</Text>

                    <View style={styles.inputWrapper}>
                        <Image style={styles.icon} source={require("../../assets/group-191.png")} />
                        <TextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor="#ccc"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Image style={styles.icon} source={require("../../assets/group-191.png")} />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#ccc"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Image style={styles.icon} source={require("../../assets/group-201.png")} />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#ccc"
                            style={styles.input}
                        />
                    </View>

                    <Pressable onPress={() => signup(username, email, password, 'user')} style={styles.signUpButton}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have account?</Text>
                        <Pressable onPress={() => navigation.navigate("SignIn")}>
                            <Text style={styles.signInText}> Sign in</Text>
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
    },
    content: {
        gap: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: "PlayfairDisplay-Bold",
        color: "#fff",
    },
    subText: {
        fontSize: 16,
        color: "#eee",
        fontFamily: "PlayfairDisplay-Regular",
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
        fontFamily: "PlayfairDisplay-Regular",
    },
    signUpButton: {
        backgroundColor: "#BE0303",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    signUpText: {
        color: "white",
        fontFamily: "PlayfairDisplay-Bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 12,
    },
    footerText: {
        color: "#ccc",
        fontFamily: "PlayfairDisplay-Regular",
    },
    signInText: {
        color: "#fff",
        fontFamily: "PlayfairDisplay-Bold",
    },
});

export default SignUp;
