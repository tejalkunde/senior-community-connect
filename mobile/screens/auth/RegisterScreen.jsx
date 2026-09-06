import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import { useAuth } from "../../context/authcontext";

const RegisterScreen = ({ navigation }) => {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("SENIOR");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (
            !trimmedName ||
            !trimmedEmail ||
            !password ||
            !confirmPassword
        ) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        if (trimmedName.length < 2) {
            Alert.alert("Invalid Name", "Please enter a valid full name.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            Alert.alert(
                "Invalid Password",
                "Password must be at least 6 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                "Password Mismatch",
                "Password and Confirm Password do not match."
            );
            return;
        }

        try {
            setLoading(true);

            await register(
                trimmedName,
                trimmedEmail,
                password,
                role
            );

            Alert.alert(
                "Registration Successful",
                "Your account has been created successfully. Please login.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Login"),
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                "Registration Failed",
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
                Join the Senior Community Platform
            </Text>

            <Text style={styles.label}>Full Name</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#667085"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#667085"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
            />

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#667085"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={styles.showButton}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                >
                    <Text style={styles.showText}>
                        {showPassword ? "Hide" : "Show"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.passwordHint}>
                Password must be at least 6 characters.
            </Text>

            <Text style={styles.label}>Confirm Password</Text>

            <View
                style={[
                    styles.passwordContainer,
                    confirmPassword &&
                        password !== confirmPassword &&
                        styles.errorInput,
                    confirmPassword &&
                        password === confirmPassword &&
                        styles.successInput,
                ]}
            >
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#667085"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={styles.showButton}
                    onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                    disabled={loading}
                >
                    <Text style={styles.showText}>
                        {showConfirmPassword ? "Hide" : "Show"}
                    </Text>
                </TouchableOpacity>
            </View>

            {confirmPassword &&
                password !== confirmPassword && (
                    <Text style={styles.errorText}>
                        Passwords do not match.
                    </Text>
                )}

            {confirmPassword &&
                password === confirmPassword &&
                password.length >= 6 && (
                    <Text style={styles.successText}>
                        Passwords match.
                    </Text>
                )}

            <Text style={styles.label}>Select Account Type</Text>

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "SENIOR" && styles.selectedRole,
                    ]}
                    onPress={() => setRole("SENIOR")}
                    disabled={loading}
                >
                    <Text style={styles.roleIcon}>👤</Text>

                    <Text
                        style={[
                            styles.roleText,
                            role === "SENIOR" &&
                                styles.selectedRoleText,
                        ]}
                    >
                        Senior Citizen
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "OWNER" && styles.selectedRole,
                    ]}
                    onPress={() => setRole("OWNER")}
                    disabled={loading}
                >
                    <Text style={styles.roleIcon}>👥</Text>

                    <Text
                        style={[
                            styles.roleText,
                            role === "OWNER" &&
                                styles.selectedRoleText,
                        ]}
                    >
                        Community Owner
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    loading && styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />

                        <Text style={styles.buttonText}>
                            Creating Account...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.buttonText}>
                        Create Account
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginContainer}
                onPress={() => navigation.navigate("Login")}
                disabled={loading}
            >
                <Text style={styles.loginText}>
                    Already have an account?{" "}
                    <Text style={styles.loginLink}>
                        Login
                    </Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 25,
        paddingBottom: 40,
        justifyContent: "center",
        backgroundColor: "#F7F9FC",
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 17,
        color: "#667085",
        marginBottom: 30,
        lineHeight: 24,
    },

    label: {
        fontSize: 17,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 8,
    },

    input: {
        height: 56,
        borderWidth: 1,
        borderColor: "#D0D5DD",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 17,
        backgroundColor: "#FFFFFF",
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
        marginBottom: 5,
    },

    passwordInput: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 16,
        fontSize: 17,
        color: "#1F2937",
    },

    showButton: {
        paddingHorizontal: 16,
        height: "100%",
        justifyContent: "center",
    },

    showText: {
        color: "#2563EB",
        fontSize: 16,
        fontWeight: "700",
    },

    passwordHint: {
        fontSize: 13,
        color: "#667085",
        marginBottom: 18,
        marginTop: 3,
    },

    errorInput: {
        borderColor: "#B42318",
    },

    successInput: {
        borderColor: "#16803C",
    },

    errorText: {
        color: "#B42318",
        fontSize: 14,
        marginBottom: 18,
        marginTop: 3,
    },

    successText: {
        color: "#16803C",
        fontSize: 14,
        marginBottom: 18,
        marginTop: 3,
    },

    roleContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 25,
    },

    roleButton: {
        flex: 1,
        minHeight: 80,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#D0D5DD",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    selectedRole: {
        borderColor: "#2563EB",
        backgroundColor: "#EFF6FF",
    },

    roleIcon: {
        fontSize: 24,
        marginBottom: 5,
    },

    roleText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#344054",
        textAlign: "center",
    },

    selectedRoleText: {
        color: "#1D4ED8",
    },

    button: {
        minHeight: 56,
        backgroundColor: "#2563EB",
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    disabledButton: {
        opacity: 0.7,
    },

    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    loginContainer: {
        marginTop: 22,
        alignItems: "center",
        paddingVertical: 10,
    },

    loginText: {
        fontSize: 16,
        color: "#667085",
    },

    loginLink: {
        color: "#2563EB",
        fontWeight: "700",
    },
});