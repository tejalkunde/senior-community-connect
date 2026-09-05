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

import { useFocusEffect } from "@react-navigation/native";

import API from "../../services/api";
import AnnouncementCard from "../../components/AnnouncementCard";

const CommunityAnnouncementsScreen = ({
    route,
}) => {
    const {
        communityId,
        communityName,
    } = route.params;

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

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#4F46E5"
                />

                <Text
                    style={styles.loadingText}
                >
                    Loading announcements...
                </Text>
            </View>
        );
    }

    if (
        error &&
        announcements.length === 0
    ) {
        return (
            <View style={styles.center}>
                <Text
                    style={styles.errorIcon}
                >
                    ⚠️
                </Text>

                <Text
                    style={styles.errorTitle}
                >
                    Unable to Load
                </Text>

                <Text
                    style={styles.errorText}
                >
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
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

            <View style={styles.header}>
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
                    Announcements
                </Text>
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
                        ? styles.emptyContainer
                        : styles.listContainer
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
                    />
                }
                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyState
                        }
                    >
                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            📢
                        </Text>

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
                            announcements
                            from this
                            community yet.
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default CommunityAnnouncementsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },

    /* HEADER */

    header: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },

    headerSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
    },

    /* LIST */

    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },

    /* LOADING */

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F5F7FB",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#6B7280",
    },

    /* ERROR */

    errorIcon: {
        fontSize: 42,
        marginBottom: 10,
    },

    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },

    errorText: {
        fontSize: 15,
        color: "#DC2626",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 22,
    },

    retryButton: {
        backgroundColor: "#4F46E5",
        paddingHorizontal: 25,
        paddingVertical: 13,
        borderRadius: 10,
    },

    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },

    /* EMPTY STATE */

    emptyContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    emptyState: {
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 45,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: "#6B7280",
        textAlign: "center",
    },
});