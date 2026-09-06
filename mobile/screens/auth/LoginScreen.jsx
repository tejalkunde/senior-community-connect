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

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    const handleLogin = async () => {

        if (!email || !password) {
            Alert.alert(
                "Error",
                "Please enter email and password"
            );
            return;
        }

        try {

            setLoading(true);

            await login(
                email,
                password
            );

        } catch (error) {

            Alert.alert(
                "Login Failed",
                error.response?.data?.message ||
                    "Something went wrong"
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
                Sign in to your Senior Community
            </Text>


            {/* EMAIL */}

            <Text style={styles.label}>
                Email
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#8A94A6"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />


            {/* PASSWORD */}

            <Text style={styles.label}>
                Password
            </Text>

            <View style={styles.passwordContainer}>

                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#8A94A6"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.showButton}
                    onPress={() =>
                        setShowPassword(
                            !showPassword
                        )
                    }
                    activeOpacity={0.7}
                >
                    <Text style={styles.showText}>
                        {showPassword
                            ? "Hide"
                            : "Show"}
                    </Text>
                </TouchableOpacity>

            </View>


            {/* LOGIN BUTTON */}

            <TouchableOpacity
                style={[
                    styles.button,
                    loading &&
                        styles.disabledButton,
                ]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
            >

                <Text style={styles.buttonText}>
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </Text>

            </TouchableOpacity>


            {/* REGISTER */}

            <TouchableOpacity
                style={styles.registerContainer}
                onPress={() =>
                    navigation.navigate(
                        "Register"
                    )
                }
                activeOpacity={0.7}
            >

                <Text style={styles.registerText}>
                    Don't have an account?{" "}
                    <Text style={styles.registerLink}>
                        Register
                    </Text>
                </Text>

            </TouchableOpacity>

        </View>
    );
};

export default LoginScreen;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: "center",
        backgroundColor: "#F7F9FC",
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 17,
        color: "#667085",
        marginBottom: 32,
        lineHeight: 24,
    },

    label: {
        fontSize: 17,
        fontWeight: "600",
        color: "#344054",
        marginBottom: 8,
    },

    input: {
        height: 56,
        borderWidth: 1,
        borderColor: "#D0D5DD",
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        fontSize: 17,
        color: "#1F2937",
        marginBottom: 18,
    },

    passwordContainer: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D0D5DD",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        marginBottom: 22,
    },

    passwordInput: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 16,
        fontSize: 17,
        color: "#1F2937",
    },

    showButton: {
        minWidth: 65,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },

    showText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2F6FED",
    },

    button: {
        height: 56,
        backgroundColor: "#2F6FED",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },

    disabledButton: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    registerContainer: {
        marginTop: 25,
        alignItems: "center",
        paddingVertical: 10,
    },

    registerText: {
        fontSize: 16,
        color: "#667085",
    },

    registerLink: {
        color: "#2F6FED",
        fontWeight: "700",
    },

});