import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "../../context/authcontext";

const ProfileScreen = () => {

    const insets = useSafeAreaInsets();

    const { user, logout } = useAuth();

    const firstLetter =
        user?.name?.charAt(0)?.toUpperCase() || "?";

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 25,
                    paddingBottom: insets.bottom + 20,
                },
            ]}
        >

            <Text style={styles.title}>
                My Profile
            </Text>

            <View style={styles.profileCard}>

                {/* Avatar */}
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {firstLetter}
                    </Text>
                </View>

                {/* Name */}
                <Text style={styles.name}>
                    {user?.name || "User"}
                </Text>

                {/* Email */}
                <Text style={styles.email}>
                    {user?.email || "No email available"}
                </Text>

                {/* Role */}
                <View style={styles.roleBadge}>
                    <Text style={styles.role}>
                        Senior Citizen
                    </Text>
                </View>

            </View>

            {/* Account Information */}
            <View style={styles.infoCard}>

                <Text style={styles.sectionTitle}>
                    Account Information
                </Text>

                <View style={styles.infoRow}>

                    <Text style={styles.label}>
                        Name
                    </Text>

                    <Text style={styles.value}>
                        {user?.name || "Not available"}
                    </Text>

                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>

                    <Text style={styles.label}>
                        Email
                    </Text>

                    <Text style={styles.value}>
                        {user?.email || "Not available"}
                    </Text>

                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>

                    <Text style={styles.label}>
                        Role
                    </Text>

                    <Text style={styles.value}>
                        Senior Citizen
                    </Text>

                </View>

            </View>

            {/* Logout */}
            <TouchableOpacity
                style={styles.logout}
                activeOpacity={0.8}
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
        backgroundColor: "#F1EEFF",
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 20,
    },

    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 25,
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#DDD6FE",

        elevation: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#DDD6FE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    avatarText: {
        fontSize: 40,
        fontWeight: "700",
        color: "#433878",
    },

    name: {
        fontSize: 25,
        fontWeight: "700",
        color: "#433878",
        textAlign: "center",
    },

    email: {
        fontSize: 17,
        marginTop: 8,
        color: "#4B5563",
        textAlign: "center",
    },

    roleBadge: {
        backgroundColor: "#E9E3FF",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 15,
    },

    role: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B5B95",
    },

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 20,
        marginTop: 20,

        borderWidth: 1,
        borderColor: "#DDD6FE",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 15,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B5B95",
        flex: 1,
    },

    value: {
        fontSize: 16,
        color: "#374151",
        flex: 1.5,
        textAlign: "right",
    },

    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
    },

    logout: {
        marginTop: 25,
        backgroundColor: "#FDECEC",
        borderWidth: 1,
        borderColor: "#F5C2C2",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
    },

    logoutText: {
        color: "#B42318",
        fontSize: 17,
        fontWeight: "700",
    },
});