import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { useAuth } from "../../context/authcontext";

const OwnerDashboardScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Welcome, {user?.name}
            </Text>

            <Text style={styles.subtitle}>
                Community Owner
            </Text>

            {/* Create Community */}
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate("CreateCommunity")
                }
            >
                <Text style={styles.cardTitle}>
                    + Create Community
                </Text>

                <Text style={styles.cardText}>
                    Create a new community for senior citizens.
                </Text>
            </TouchableOpacity>

            {/* My Communities */}
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate("OwnerMyCommunities")
                }
            >
                <Text style={styles.cardTitle}>
                    My Communities
                </Text>

                <Text style={styles.cardText}>
                    View and manage communities you own.
                </Text>
            </TouchableOpacity>

            {/* Logout */}
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

export default OwnerDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F7F9FC",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 20,
        color: "#222",
    },

    subtitle: {
        fontSize: 18,
        marginBottom: 25,
        color: "#666",
    },

    card: {
        backgroundColor: "#fff",
        padding: 22,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#208AEF",
    },

    cardText: {
        fontSize: 16,
        marginTop: 8,
        lineHeight: 22,
        color: "#555",
    },

    logout: {
        marginTop: "auto",
        padding: 20,
        alignItems: "center",
    },

    logoutText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#D32F2F",
    },
});