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
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/authContext";

const SignUp = () => {
    const navigation = useNavigation();
    const { signup, userInfo, isLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (userInfo != null) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
    }, [navigation, userInfo]);

    const handleSignUp = () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        
        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        
        signup(username, email, password, 'user');
    };

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
                            keyboardType="email-address"
                            autoCapitalize="none"
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

                    <Pressable 
                        onPress={handleSignUp} 
                        style={[styles.signUpButton, isLoading && styles.disabledButton]}
                        disabled={isLoading}
                    >
                        <Text style={styles.signUpText}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
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
        fontFamily: "Inter-Bold",
    },
    content: {
        gap: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: "Inter-Bold",
        color: "#fff",
    },
    subText: {
        fontSize: 16,
        color: "#eee",
        fontFamily: "Inter-Regular",
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
        fontFamily: "Inter-Regular",
    },
    signUpButton: {
        backgroundColor: "#BE0303",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#882222",
        opacity: 0.7,
    },
    signUpText: {
        color: "white",
        fontFamily: "Inter-Bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 12,
    },
    footerText: {
        color: "#ccc",
        fontFamily: "Inter-Regular",
    },
    signInText: {
        color: "#fff",
        fontFamily: "Inter-Bold",
    },
});

export default SignUp;