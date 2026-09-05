import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import API from "../../services/api";

const OwnerMyCommunitiesScreen = ({ navigation }) => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadCommunities = async () => {
        try {
            setError("");

            const response = await API.get("/communities/my");

            const data = response.data.communities || response.data;

            setCommunities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Owner communities error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load your communities."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCommunities();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadCommunities();
    };

    const getStatusStyle = (status) => {
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

    const renderCommunity = ({ item }) => {
        const status = item.status || "PENDING";

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate("ManageCommunity", {
                        communityId: item._id,
                    })
                }
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                    </Text>

                    <View
                        style={[
                            styles.statusBadge,
                            getStatusStyle(status),
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {status}
                        </Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={3}>
                    {item.description}
                </Text>

                {item.category && (
                    <Text style={styles.category}>
                        Category: {item.category}
                    </Text>
                )}

                <Text style={styles.manageText}>
                    Tap to manage →
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading your communities...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    My Communities
                </Text>

                <Text style={styles.subtitle}>
                    Communities created by you
                </Text>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadCommunities}
                    >
                        <Text style={styles.retryText}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : communities.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🏘️</Text>

                    <Text style={styles.emptyTitle}>
                        No Communities Yet
                    </Text>

                    <Text style={styles.emptyText}>
                        You haven't created any communities yet.
                    </Text>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() =>
                            navigation.navigate(
                                "CreateCommunity"
                            )
                        }
                    >
                        <Text style={styles.createButtonText}>
                            Create Community
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={communities}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCommunity}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() =>
                    navigation.navigate("CreateCommunity")
                }
            >
                <Text style={styles.floatingButtonText}>
                    +
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },

    subtitle: {
        fontSize: 16,
        color: "#666",
        marginTop: 6,
    },

    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },

    name: {
        flex: 1,
        fontSize: 21,
        fontWeight: "bold",
        color: "#222",
        marginRight: 10,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },

    pending: {
        backgroundColor: "#FFF3CD",
    },

    approved: {
        backgroundColor: "#D1E7DD",
    },

    rejected: {
        backgroundColor: "#F8D7DA",
    },

    inactive: {
        backgroundColor: "#E2E3E5",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },

    description: {
        fontSize: 16,
        lineHeight: 23,
        color: "#555",
        marginBottom: 10,
    },

    category: {
        fontSize: 14,
        color: "#777",
        marginBottom: 12,
    },

    manageText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#208AEF",
        marginTop: 5,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FC",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#555",
    },

    errorContainer: {
        margin: 24,
        padding: 20,
        backgroundColor: "#F8D7DA",
        borderRadius: 12,
        alignItems: "center",
    },

    errorText: {
        fontSize: 16,
        color: "#842029",
        textAlign: "center",
        marginBottom: 15,
    },

    retryButton: {
        backgroundColor: "#842029",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },

    retryText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 50,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 23,
        marginBottom: 25,
    },

    createButton: {
        backgroundColor: "#208AEF",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
    },

    createButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "bold",
    },

    floatingButton: {
        position: "absolute",
        right: 24,
        bottom: 25,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#208AEF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    floatingButtonText: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "300",
        marginTop: -3,
    },
});

export default OwnerMyCommunitiesScreen;