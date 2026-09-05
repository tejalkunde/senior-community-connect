import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { useAuth } from "../../context/authcontext";

const ProfileScreen = () => {

    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>

            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                </Text>
            </View>

            <Text style={styles.name}>
                {user?.name}
            </Text>

            <Text style={styles.email}>
                {user?.email}
            </Text>

            <Text style={styles.role}>
                Senior Citizen
            </Text>

            <TouchableOpacity
                style={styles.logout}
                onPress={logout}
            >
                <Text style={styles.logoutText}>
                    Logout
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 30,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },

    avatarText: {
        fontSize: 40,
        fontWeight: "700",
    },

    name: {
        fontSize: 25,
        fontWeight: "700",
        marginTop: 20,
    },

    email: {
        fontSize: 17,
        marginTop: 8,
    },

    role: {
        fontSize: 16,
        marginTop: 10,
    },

    logout: {
        marginTop: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 12,
    },

    logoutText: {
        fontSize: 17,
        fontWeight: "600",
    },
});