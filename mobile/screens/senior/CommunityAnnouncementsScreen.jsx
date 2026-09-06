import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import API from "../../services/api";
import AnnouncementCard from "../../components/AnnouncementCard";

const CommunityAnnouncementsScreen = ({
    route,
}) => {

    const {
        communityId,
        communityName,
    } = route.params;

    const insets = useSafeAreaInsets();

    const [announcements, setAnnouncements] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const fetchAnnouncements = async () => {

        try {

            setError("");

            const response = await API.get(
                `/communities/${communityId}/announcements`
            );

            const data =
                response.data.announcements ||
                response.data ||
                [];

            // Newest announcements first
            const sortedAnnouncements = [
                ...data,
            ].sort((a, b) => {
                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );
            });

            setAnnouncements(
                sortedAnnouncements
            );

        } catch (err) {

            console.error(
                "Fetch announcements error:",
                err.response?.data ||
                err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to load announcements."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnnouncements();
        }, [communityId])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAnnouncements();
    };

    const handleRetry = () => {
        setLoading(true);
        fetchAnnouncements();
    };

    const renderAnnouncement = ({
        item,
    }) => {

        return (
            <AnnouncementCard
                announcement={item}
            />
        );
    };

    /* LOADING */

    if (loading) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color="#B45309"
                />

                <Text style={styles.loadingText}>
                    Loading announcements...
                </Text>

            </View>
        );
    }

    /* ERROR */

    if (
        error &&
        announcements.length === 0
    ) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}
            >

                <Text style={styles.errorIcon}>
                    ⚠️
                </Text>

                <Text style={styles.errorTitle}>
                    Unable to Load
                </Text>

                <Text style={styles.errorText}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    activeOpacity={0.8}
                    onPress={handleRetry}
                >

                    <Text
                        style={
                            styles.retryButtonText
                        }
                    >
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}

            <View
                style={[
                    styles.header,
                    {
                        paddingTop:
                            insets.top + 15,
                    },
                ]}
            >

                <View style={styles.headerIcon}>

                    <Text style={styles.headerIconText}>
                        📢
                    </Text>

                </View>

                <View style={styles.headerContent}>

                    <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                    >
                        {communityName ||
                            "Community"}
                    </Text>

                    <Text
                        style={styles.headerSubtitle}
                    >
                        Community Announcements
                    </Text>

                </View>

            </View>

            {/* ANNOUNCEMENTS */}

            <FlatList
                data={announcements}

                keyExtractor={(
                    item,
                    index
                ) =>
                    item._id ||
                    index.toString()
                }

                renderItem={
                    renderAnnouncement
                }

                contentContainerStyle={
                    announcements.length === 0
                        ? [
                            styles.emptyContainer,
                            {
                                paddingBottom:
                                    insets.bottom +
                                    30,
                            },
                        ]
                        : [
                            styles.listContainer,
                            {
                                paddingBottom:
                                    insets.bottom +
                                    30,
                            },
                        ]
                }

                showsVerticalScrollIndicator={
                    false
                }

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={
                            handleRefresh
                        }
                        colors={["#B45309"]}
                        tintColor="#B45309"
                    />
                }

                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyState
                        }
                    >

                        <View
                            style={
                                styles.emptyIconContainer
                            }
                        >

                            <Text
                                style={
                                    styles.emptyIcon
                                }
                            >
                                📢
                            </Text>

                        </View>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            No Announcements
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            There are no
                            announcements from
                            this community yet.
                        </Text>

                    </View>
                }
            />

        </View>
    );
};

export default CommunityAnnouncementsScreen;


const styles = StyleSheet.create({

    /* MAIN SCREEN */

    container: {
        flex: 1,
        backgroundColor: "#FFF8E1",
    },


    /* HEADER */

    header: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 20,
        paddingBottom: 17,

        borderBottomWidth: 1,
        borderBottomColor: "#F3E8B3",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },

    headerIcon: {
        width: 52,
        height: 52,

        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FEF3C7",

        marginRight: 14,
    },

    headerIconText: {
        fontSize: 28,
    },

    headerContent: {
        flex: 1,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#78350F",
    },

    headerSubtitle: {
        fontSize: 15,
        color: "#92400E",
        marginTop: 4,
    },


    /* LIST */

    listContainer: {
        padding: 16,
    },


    /* LOADING */

    center: {
        flex: 1,

        justifyContent: "center",
        alignItems: "center",

        paddingHorizontal: 20,

        backgroundColor: "#FFF8E1",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#78350F",
    },


    /* ERROR */

    errorIcon: {
        fontSize: 45,
        marginBottom: 12,
    },

    errorTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#78350F",
        marginBottom: 8,
    },

    errorText: {
        fontSize: 16,
        color: "#B42318",
        textAlign: "center",
        marginBottom: 22,
        lineHeight: 23,
    },

    retryButton: {
        backgroundColor: "#B45309",

        paddingHorizontal: 28,
        paddingVertical: 15,

        borderRadius: 12,

        elevation: 2,
    },

    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },


    /* EMPTY */

    emptyContainer: {
        flexGrow: 1,

        justifyContent: "center",

        paddingHorizontal: 20,
    },

    emptyState: {
        alignItems: "center",

        paddingHorizontal: 20,
    },

    emptyIconContainer: {
        width: 85,
        height: 85,

        borderRadius: 25,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FEF3C7",

        marginBottom: 18,
    },

    emptyIcon: {
        fontSize: 42,
    },

    emptyTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#78350F",

        marginBottom: 8,
    },

    emptyText: {
        fontSize: 16,
        lineHeight: 24,

        color: "#92400E",

        textAlign: "center",
    },

});