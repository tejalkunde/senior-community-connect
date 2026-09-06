import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import API from "../../services/api";

const OwnerMyCommunitiesScreen = ({
    navigation,
}) => {

    const insets = useSafeAreaInsets();

    const [communities, setCommunities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD COMMUNITIES
    // =====================================================

    const loadCommunities = async () => {

        try {

            setError("");

            const response =
                await API.get(
                    "/communities/my"
                );

            const data =
                response.data.communities ||
                response.data ||
                [];

            setCommunities(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(
                "Owner communities error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your communities."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };

    // =====================================================
    // REFRESH WHEN SCREEN GETS FOCUS
    // =====================================================

    useFocusEffect(
        useCallback(() => {

            loadCommunities();

        }, [])
    );

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        setRefreshing(true);

        loadCommunities();

    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (
        status
    ) => {

        switch (status) {

            case "APPROVED":
                return styles.approved;

            case "REJECTED":
                return styles.rejected;

            case "INACTIVE":
                return styles.inactive;

            default:
                return styles.pending;
        }
    };

    const getStatusTextStyle = (
        status
    ) => {

        switch (status) {

            case "APPROVED":
                return styles.approvedText;

            case "REJECTED":
                return styles.rejectedText;

            case "INACTIVE":
                return styles.inactiveText;

            default:
                return styles.pendingText;
        }
    };

    // =====================================================
    // COMMUNITY CARD
    // =====================================================

    const renderCommunity = ({
        item,
    }) => {

        const status =
            item.status || "PENDING";

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                    navigation.navigate(
                        "ManageCommunity",
                        {
                            communityId:
                                item._id,
                        }
                    )
                }
            >

                {/* CARD TOP */}

                <View style={styles.cardTop}>

                    <View style={styles.communityIcon}>

                        <Text
                            style={
                                styles.communityIconText
                            }
                        >
                            👥
                        </Text>

                    </View>

                    <View style={styles.titleContainer}>

                        <Text
                            style={styles.name}
                            numberOfLines={2}
                        >
                            {item.name}
                        </Text>

                        {item.category ? (

                            <Text
                                style={
                                    styles.category
                                }
                                numberOfLines={1}
                            >
                                {item.category}
                            </Text>

                        ) : null}

                    </View>

                </View>

                {/* STATUS */}

                <View
                    style={[
                        styles.statusBadge,
                        getStatusStyle(status),
                    ]}
                >

                    <View
                        style={[
                            styles.statusDot,
                            getStatusStyle(status),
                        ]}
                    />

                    <Text
                        style={[
                            styles.statusText,
                            getStatusTextStyle(status),
                        ]}
                    >
                        {status}
                    </Text>

                </View>

                {/* DESCRIPTION */}

                <Text
                    style={styles.description}
                    numberOfLines={3}
                >
                    {item.description ||
                        "No description available."}
                </Text>

                {/* MEMBER COUNT */}

                <View style={styles.memberRow}>

                    <Text style={styles.memberIcon}>
                        👤
                    </Text>

                    <Text style={styles.memberText}>
                        {item.memberCount || 0} members
                    </Text>

                </View>

                {/* MANAGE */}

                <View style={styles.manageRow}>

                    <Text style={styles.manageText}>
                        Manage Community
                    </Text>

                    <Text style={styles.arrow}>
                        ›
                    </Text>

                </View>

            </TouchableOpacity>
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop:
                            insets.top,
                        paddingBottom:
                            insets.bottom,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color="#7C3AED"
                />

                <Text style={styles.loadingText}>
                    Loading your communities...
                </Text>

            </View>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (
        error &&
        communities.length === 0
    ) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop:
                            insets.top,
                        paddingBottom:
                            insets.bottom,
                    },
                ]}
            >

                <View style={styles.errorIconContainer}>

                    <Text style={styles.errorIcon}>
                        ⚠️
                    </Text>

                </View>

                <Text style={styles.errorTitle}>
                    Unable to Load
                </Text>

                <Text style={styles.errorText}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    activeOpacity={0.8}
                    onPress={() => {

                        setLoading(true);

                        loadCommunities();

                    }}
                >

                    <Text style={styles.retryText}>
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>
        );
    }

    // =====================================================
    // MAIN SCREEN
    // =====================================================

    return (
        <View style={styles.container}>

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <View
                style={[
                    styles.header,
                    {
                        paddingTop:
                            insets.top + 18,
                    },
                ]}
            >

                <Text style={styles.title}>
                    My Communities
                </Text>

                <Text style={styles.subtitle}>
                    Communities created and managed by you
                </Text>

                {/* COMMUNITY COUNT */}

                <View style={styles.countBadge}>

                    <Text style={styles.countIcon}>
                        👥
                    </Text>

                    <Text style={styles.countText}>
                        {communities.length}{" "}
                        {communities.length === 1
                            ? "Community"
                            : "Communities"}
                    </Text>

                </View>

            </View>

            {/* ========================================= */}
            {/* EMPTY STATE */}
            {/* ========================================= */}

            {communities.length === 0 ? (

                <View style={styles.emptyContainer}>

                    <View
                        style={
                            styles.emptyIconContainer
                        }
                    >

                        <Text style={styles.emptyIcon}>
                            🏘️
                        </Text>

                    </View>

                    <Text style={styles.emptyTitle}>
                        No Communities Yet
                    </Text>

                    <Text style={styles.emptyText}>
                        You haven't created any
                        communities yet. Create your
                        first community to get started.
                    </Text>

                    <TouchableOpacity
                        style={styles.createButton}
                        activeOpacity={0.8}
                        onPress={() =>
                            navigation.navigate(
                                "CreateCommunity"
                            )
                        }
                    >

                        <Text
                            style={
                                styles.createButtonIcon
                            }
                        >
                            +
                        </Text>

                        <Text
                            style={
                                styles.createButtonText
                            }
                        >
                            Create Community
                        </Text>

                    </TouchableOpacity>

                </View>

            ) : (

                /* ========================================= */
                /* COMMUNITY LIST */
                /* ========================================= */

                <FlatList
                    data={communities}

                    keyExtractor={(item) =>
                        item._id
                    }

                    renderItem={
                        renderCommunity
                    }

                    contentContainerStyle={[
                        styles.list,
                        {
                            paddingBottom:
                                insets.bottom +
                                100,
                        },
                    ]}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={
                                handleRefresh
                            }
                            colors={["#7C3AED"]}
                            tintColor="#7C3AED"
                        />
                    }

                    showsVerticalScrollIndicator={
                        false
                    }
                />

            )}

            {/* ========================================= */}
            {/* FLOATING CREATE BUTTON */}
            {/* ========================================= */}

            <TouchableOpacity
                style={[
                    styles.floatingButton,
                    {
                        bottom:
                            insets.bottom + 80,
                    },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                    navigation.navigate(
                        "CreateCommunity"
                    )
                }
            >

                <Text
                    style={
                        styles.floatingButtonText
                    }
                >
                    +
                </Text>

            </TouchableOpacity>

        </View>
    );
};

export default OwnerMyCommunitiesScreen;

const styles = StyleSheet.create({

    /* ========================================= */
    /* CONTAINER */
    /* ========================================= */

    container: {
        flex: 1,
        backgroundColor: "#F3F0FF",
    },

    /* ========================================= */
    /* HEADER */
    /* ========================================= */

    header: {
        paddingHorizontal: 20,
        paddingBottom: 17,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#433878",
    },

    subtitle: {
        fontSize: 16,
        color: "#6B5B95",
        marginTop: 5,
        lineHeight: 22,
    },

    countBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#E9E3FF",
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 13,
    },

    countIcon: {
        fontSize: 17,
        marginRight: 6,
    },

    countText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6B5B95",
    },

    /* ========================================= */
    /* LIST */
    /* ========================================= */

    list: {
        paddingHorizontal: 20,
        paddingTop: 5,
    },

    /* ========================================= */
    /* COMMUNITY CARD */
    /* ========================================= */

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#DDD6FE",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 5,
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 13,
    },

    communityIcon: {
        width: 55,
        height: 55,
        borderRadius: 16,
        backgroundColor: "#EDE9FE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 13,
    },

    communityIconText: {
        fontSize: 29,
    },

    titleContainer: {
        flex: 1,
    },

    name: {
        fontSize: 21,
        fontWeight: "800",
        color: "#433878",
    },

    category: {
        fontSize: 15,
        color: "#6B5B95",
        marginTop: 4,
    },

    /* ========================================= */
    /* STATUS */
    /* ========================================= */

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 6,
    },

    pending: {
        backgroundColor: "#FEF3C7",
    },

    approved: {
        backgroundColor: "#DCFCE7",
    },

    rejected: {
        backgroundColor: "#FEE2E2",
    },

    inactive: {
        backgroundColor: "#E5E7EB",
    },

    statusText: {
        fontSize: 13,
        fontWeight: "700",
    },

    pendingText: {
        color: "#92400E",
    },

    approvedText: {
        color: "#166534",
    },

    rejectedText: {
        color: "#B42318",
    },

    inactiveText: {
        color: "#4B5563",
    },

    /* ========================================= */
    /* DESCRIPTION */
    /* ========================================= */

    description: {
        fontSize: 16,
        lineHeight: 23,
        color: "#4B5563",
        marginBottom: 12,
    },

    /* ========================================= */
    /* MEMBERS */
    /* ========================================= */

    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 13,
    },

    memberIcon: {
        fontSize: 17,
        marginRight: 7,
    },

    memberText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6B5B95",
    },

    /* ========================================= */
    /* MANAGE */
    /* ========================================= */

    manageRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 12,
    },

    manageText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#7C3AED",
    },

    arrow: {
        fontSize: 28,
        color: "#7C3AED",
        lineHeight: 28,
    },

    /* ========================================= */
    /* LOADING */
    /* ========================================= */

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        backgroundColor: "#F3F0FF",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6B5B95",
    },

    /* ========================================= */
    /* ERROR */
    /* ========================================= */

    errorIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: "#FEE2E2",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    errorIcon: {
        fontSize: 40,
    },

    errorTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 8,
    },

    errorText: {
        fontSize: 16,
        lineHeight: 23,
        color: "#B42318",
        textAlign: "center",
        marginBottom: 20,
    },

    retryButton: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
        elevation: 2,
    },

    retryText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    /* ========================================= */
    /* EMPTY */
    /* ========================================= */

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingBottom: 80,
    },

    emptyIconContainer: {
        width: 95,
        height: 95,
        borderRadius: 28,
        backgroundColor: "#EDE9FE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    emptyIcon: {
        fontSize: 48,
    },

    emptyTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#433878",
        textAlign: "center",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#6B5B95",
        textAlign: "center",
        marginBottom: 25,
    },

    createButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7C3AED",
        paddingHorizontal: 23,
        paddingVertical: 15,
        borderRadius: 13,
        elevation: 3,
    },

    createButtonIcon: {
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "400",
        marginRight: 8,
    },

    createButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    /* ========================================= */
    /* FLOATING BUTTON */
    /* ========================================= */

    floatingButton: {
        position: "absolute",
        right: 20,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },

    floatingButtonText: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "300",
        marginTop: -3,
    },

});