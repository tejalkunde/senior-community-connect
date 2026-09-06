import React, { useCallback, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API from "../../services/api";
import AnnouncementCard from "../../components/AnnouncementCard";

const CommunityAnnouncementsScreen = ({ route }) => {
    const { communityId, communityName } = route.params || {};
    const insets = useSafeAreaInsets();

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Fetch announcements
    const fetchAnnouncements = async () => {
        try {
            setError("");

            const response = await API.get(
                `/communities/${communityId}/announcements`
            );

            console.log("Announcements API response:", response.data);

            const data =
                response.data?.data ||
                response.data?.announcements ||
                [];

            const announcementsArray = Array.isArray(data) ? data : [];

            // Newest announcements first
            const sortedAnnouncements = [...announcementsArray].sort(
                (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
            );

            console.log("Announcements:", sortedAnnouncements);

            setAnnouncements(sortedAnnouncements);
        } catch (err) {
            console.error(
                "Fetch announcements error:",
                err.response?.data || err.message
            );

            setAnnouncements([]);

            setError(
                err.response?.data?.message ||
                    "Failed to load announcements."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Reload whenever screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (communityId) {
                fetchAnnouncements();
            }
        }, [communityId])
    );

    // Pull to refresh
    const handleRefresh = () => {
        setRefreshing(true);
        fetchAnnouncements();
    };

    // Retry after error
    const handleRetry = () => {
        setLoading(true);
        fetchAnnouncements();
    };

    const renderAnnouncement = ({ item }) => (
        <AnnouncementCard announcement={item} />
    );

    // Loading screen
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
                    color="#0F766E"
                />

                <Text style={styles.loadingText}>
                    Loading announcements...
                </Text>
            </View>
        );
    }

    // Error screen
    if (error && announcements.length === 0) {
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
                <Text style={styles.errorIcon}>⚠️</Text>

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
                    <Text style={styles.retryButtonText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        paddingTop: insets.top + 15,
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
                        {communityName || "Community"}
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Community Announcements
                    </Text>
                </View>
            </View>

            {/* Announcements */}
            <FlatList
                data={announcements}
                keyExtractor={(item, index) =>
                    item?._id || index.toString()
                }
                renderItem={renderAnnouncement}
                contentContainerStyle={
                    announcements.length === 0
                        ? [
                              styles.emptyContainer,
                              {
                                  paddingBottom:
                                      insets.bottom + 30,
                              },
                          ]
                        : [
                              styles.listContainer,
                              {
                                  paddingBottom:
                                      insets.bottom + 30,
                              },
                          ]
                }
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#0F766E"]}
                        tintColor="#0F766E"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Text style={styles.emptyIcon}>
                                📢
                            </Text>
                        </View>

                        <Text style={styles.emptyTitle}>
                            No Announcements
                        </Text>

                        <Text style={styles.emptyText}>
                            There are no announcements from this
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
    // Main background same as CommunitiesScreen
    container: {
        flex: 1,
        backgroundColor: "#E6F7F5",
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingBottom: 17,

        borderBottomWidth: 1,
        borderBottomColor: "#B7E4DF",

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

        backgroundColor: "#CCFBF1",

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
        color: "#155E75",
    },

    headerSubtitle: {
        fontSize: 15,
        color: "#0F766E",
        marginTop: 4,
    },

    // List
    listContainer: {
        padding: 16,
    },

    // Loading / Error
    center: {
        flex: 1,

        justifyContent: "center",
        alignItems: "center",

        paddingHorizontal: 20,

        backgroundColor: "#E6F7F5",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#155E75",
    },

    errorIcon: {
        fontSize: 45,
        marginBottom: 12,
    },

    errorTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#155E75",
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
        backgroundColor: "#0F766E",

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

    // Empty state
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

        backgroundColor: "#CCFBF1",

        marginBottom: 18,
    },

    emptyIcon: {
        fontSize: 42,
    },

    emptyTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#0F766E",
        textAlign: "center",
    },
});