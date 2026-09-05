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

const RegisterScreen = ({ navigation }) => {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("SENIOR");

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            await register(
                name,
                email,
                password,
                role
            );

            Alert.alert(
                "Success",
                "Registration successful. Please login."
            );

            navigation.navigate("Login");

        } catch (error) {
            Alert.alert(
                "Registration Failed",
                error.response?.data?.message ||
                    "Something went wrong"
            );
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Create Account
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
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

            <Text style={styles.label}>
                Select Account Type
            </Text>

            <View style={styles.roleContainer}>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "SENIOR" && styles.selectedRole,
                    ]}
                    onPress={() => setRole("SENIOR")}
                >
                    <Text>Senior Citizen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "OWNER" && styles.selectedRole,
                    ]}
                    onPress={() => setRole("OWNER")}
                >
                    <Text>Community Owner</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>
                    Register
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        justifyContent: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 25,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 16,
        fontSize: 17,
        marginBottom: 15,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },

    roleContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },

    roleButton: {
        flex: 1,
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        alignItems: "center",
    },

    selectedRole: {
        borderColor: "#2563EB",
        backgroundColor: "#DBEAFE",
    },

    button: {
        backgroundColor: "#2563EB",
        padding: 17,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});