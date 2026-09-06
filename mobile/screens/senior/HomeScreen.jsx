import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

import { useAuth } from "../../context/authcontext";

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >
            <Text style={styles.welcome}>
                Welcome, {user?.name || "Senior"}
            </Text>

            <Text style={styles.subtitle}>
                Discover communities, meet people and stay connected.
            </Text>

            <TouchableOpacity
                style={styles.primaryCard}
                onPress={() =>
                    navigation.navigate("Communities")
                }
            >
                <Text style={styles.cardIcon}>🔎</Text>

                <Text style={styles.cardTitle}>
                    Find Communities
                </Text>

                <Text style={styles.cardText}>
                    Explore communities created especially for
                    senior citizens.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate("MyCommunities")
                }
            >
                <Text style={styles.cardIcon}>👥</Text>

                <Text style={styles.cardTitle}>
                    My Communities
                </Text>

                <Text style={styles.cardText}>
                    View the communities you have joined.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate("Profile")
                }
            >
                <Text style={styles.cardIcon}>👤</Text>

                <Text style={styles.cardTitle}>
                    My Profile
                </Text>

                <Text style={styles.cardText}>
                    View and manage your profile.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={logout}
            >
                <Text style={styles.logoutText}>
                    Logout
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F7F9FC",
    },

    welcome: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
        marginTop: 10,
    },

    subtitle: {
        fontSize: 15,
        color: "#6B7280",
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 25,
    },

    primaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 22,
        marginBottom: 16,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 22,
        marginBottom: 16,

        elevation: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },

    cardIcon: {
        fontSize: 30,
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
    },

    primaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 22,
        marginBottom: 16,
        elevation: 3,
    },

    primaryCardTitle: {
        color: "#FFFFFF",
    },

    cardText: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 7,
        lineHeight: 21,
    },

    logoutButton: {
        backgroundColor: "#FEE2E2",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },

    logoutText: {
        color: "#DC2626",
        fontSize: 16,
        fontWeight: "700",
    },
});