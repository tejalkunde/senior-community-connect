import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "../../context/authcontext";

const OwnerProfileScreen = () => {

    const insets = useSafeAreaInsets();

    const {
        user,
        logout,
    } = useAuth();

    const firstLetter =
        user?.name?.charAt(0)?.toUpperCase() || "?";

    const handleLogout = () => {

        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",

            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Logout",
                    style: "destructive",
                    onPress: logout,
                },
            ]
        );
    };

    return (
        <View style={styles.safeArea}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {
                        paddingTop:
                            insets.top + 20,

                        paddingBottom:
                            insets.bottom + 100,
                    },
                ]}
            >

                {/* ========================================= */}
                {/* TITLE */}
                {/* ========================================= */}

                <Text style={styles.title}>
                    My Profile
                </Text>

                <Text style={styles.subtitle}>
                    Manage your owner account
                </Text>

                {/* ========================================= */}
                {/* PROFILE CARD */}
                {/* ========================================= */}

                <View style={styles.profileCard}>

                    <View style={styles.avatar}>

                        <Text style={styles.avatarText}>
                            {firstLetter}
                        </Text>

                    </View>

                    <Text style={styles.name}>
                        {user?.name || "Owner"}
                    </Text>

                    <Text style={styles.email}>
                        {user?.email ||
                            "No email available"}
                    </Text>

                    <View style={styles.roleBadge}>

                        <Text style={styles.roleIcon}>
                            🏠
                        </Text>

                        <Text style={styles.role}>
                            Community Owner
                        </Text>

                    </View>

                </View>

                {/* ========================================= */}
                {/* ACCOUNT INFORMATION */}
                {/* ========================================= */}

                <View style={styles.infoCard}>

                    <Text style={styles.sectionTitle}>
                        Account Information
                    </Text>

                    {/* NAME */}

                    <View style={styles.infoRow}>

                        <View style={styles.infoLabelContainer}>

                            <Text style={styles.infoIcon}>
                                👤
                            </Text>

                            <Text style={styles.label}>
                                Name
                            </Text>

                        </View>

                        <Text
                            style={styles.value}
                            numberOfLines={1}
                        >
                            {user?.name ||
                                "Not available"}
                        </Text>

                    </View>

                    <View style={styles.divider} />

                    {/* EMAIL */}

                    <View style={styles.infoRow}>

                        <View style={styles.infoLabelContainer}>

                            <Text style={styles.infoIcon}>
                                ✉️
                            </Text>

                            <Text style={styles.label}>
                                Email
                            </Text>

                        </View>

                        <Text
                            style={styles.value}
                            numberOfLines={1}
                        >
                            {user?.email ||
                                "Not available"}
                        </Text>

                    </View>

                    <View style={styles.divider} />

                    {/* ROLE */}

                    <View style={styles.infoRow}>

                        <View style={styles.infoLabelContainer}>

                            <Text style={styles.infoIcon}>
                                🏠
                            </Text>

                            <Text style={styles.label}>
                                Role
                            </Text>

                        </View>

                        <Text style={styles.value}>
                            Community Owner
                        </Text>

                    </View>

                </View>

                {/* ========================================= */}
                {/* OWNER RESPONSIBILITY */}
                {/* ========================================= */}

                <View style={styles.responsibilityCard}>

                    <View style={styles.responsibilityIcon}>

                        <Text style={styles.responsibilityIconText}>
                            ⭐
                        </Text>

                    </View>

                    <View style={styles.responsibilityContent}>

                        <Text style={styles.responsibilityTitle}>
                            Your Role
                        </Text>

                        <Text style={styles.responsibilityText}>
                            As a community owner, you can
                            create communities, manage
                            members and share important
                            announcements.
                        </Text>

                    </View>

                </View>

                {/* ========================================= */}
                {/* LOGOUT */}
                {/* ========================================= */}

                <TouchableOpacity
                    style={styles.logoutButton}
                    activeOpacity={0.8}
                    onPress={handleLogout}
                >

                    

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        </View>
    );
};

export default OwnerProfileScreen;

const styles = StyleSheet.create({

    /* ========================================= */
    /* CONTAINER */
    /* ========================================= */

    safeArea: {
        flex: 1,
        backgroundColor: "#F3F0FF",
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },

    /* ========================================= */
    /* HEADER */
    /* ========================================= */

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#433878",
    },

    subtitle: {
        fontSize: 16,
        color: "#6B5B95",
        marginTop: 5,
        marginBottom: 20,
    },

    /* ========================================= */
    /* PROFILE CARD */
    /* ========================================= */

    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
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
        marginBottom: 20,
    },

    avatar: {
        width: 105,
        height: 105,
        borderRadius: 53,
        backgroundColor: "#DDD6FE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 17,
    },

    avatarText: {
        fontSize: 42,
        fontWeight: "800",
        color: "#433878",
    },

    name: {
        fontSize: 25,
        fontWeight: "800",
        color: "#433878",
        textAlign: "center",
    },

    email: {
        fontSize: 17,
        color: "#4B5563",
        marginTop: 7,
        textAlign: "center",
    },

    roleBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E9E3FF",
        paddingHorizontal: 17,
        paddingVertical: 9,
        borderRadius: 20,
        marginTop: 15,
    },

    roleIcon: {
        fontSize: 18,
        marginRight: 7,
    },

    role: {
        fontSize: 16,
        fontWeight: "700",
        color: "#6B5B95",
    },

    /* ========================================= */
    /* ACCOUNT INFORMATION */
    /* ========================================= */

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 20,
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
        marginBottom: 18,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 15,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 48,
    },

    infoLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    infoIcon: {
        fontSize: 20,
        width: 35,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B5B95",
    },

    value: {
        flex: 1.3,
        fontSize: 15,
        color: "#374151",
        textAlign: "right",
    },

    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 3,
    },

    /* ========================================= */
    /* RESPONSIBILITY */
    /* ========================================= */

    responsibilityCard: {
        flexDirection: "row",
        backgroundColor: "#EDE9FE",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#DDD6FE",
        marginBottom: 20,
    },

    responsibilityIcon: {
        width: 52,
        height: 52,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 13,
    },

    responsibilityIconText: {
        fontSize: 27,
    },

    responsibilityContent: {
        flex: 1,
    },

    responsibilityTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#433878",
    },

    responsibilityText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#5B556F",
        marginTop: 5,
    },

    /* ========================================= */
    /* LOGOUT */
    /* ========================================= */

    logoutButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FDECEC",
        borderWidth: 1,
        borderColor: "#F5C2C2",
        borderRadius: 14,
        paddingVertical: 16,
        marginBottom: 10,
    },

    logoutIcon: {
        fontSize: 21,
        marginRight: 9,
    },

    logoutText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#B42318",
    },

});