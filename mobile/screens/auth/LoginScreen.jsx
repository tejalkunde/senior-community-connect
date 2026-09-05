import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

import { useAuth } from "../../context/authcontext";

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            await login(email, password);

        } catch (error) {
            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Welcome Back
            </Text>

            <Text style={styles.subtitle}>
                Senior Community Platform
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={styles.registerText}>
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        justifyContent: "center",
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 18,
        marginBottom: 30,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        marginBottom: 15,
    },

    button: {
        backgroundColor: "#2563EB",
        padding: 17,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },

    registerText: {
        textAlign: "center",
        marginTop: 25,
        fontSize: 16,
    },
});