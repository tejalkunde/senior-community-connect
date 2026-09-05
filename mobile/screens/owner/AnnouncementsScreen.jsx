import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";

import API from "../../services/api";

const AnnouncementsScreen = ({ route, navigation }) => {
    const { communityId } = route.params;

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const loadAnnouncements = async () => {
        try {
            const response = await API.get(
                `/communities/${communityId}/announcements`
            );

            const data =
                response.data.announcements ||
                response.data;

            setAnnouncements(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.log(
                "Load announcements error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to load announcements."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAnnouncements();
    }, [communityId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadAnnouncements();
    };

    const handleDelete = (announcementId) => {
        Alert.alert(
            "Delete Announcement",
            "Are you sure you want to delete this announcement?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                        deleteAnnouncement(
                            announcementId
                        ),
                },
            ]
        );
    };

    const deleteAnnouncement = async (announcementId) => {
        try {
            setDeletingId(announcementId);

            await API.delete(
                `/announcements/${announcementId}`
            );

            setAnnouncements((current) =>
                current.filter(
                    (item) =>
                        item._id !== announcementId
                )
            );

            Alert.alert(
                "Success",
                "Announcement deleted successfully."
            );
        } catch (error) {
            console.log(
                "Delete announcement error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to delete announcement."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const renderAnnouncement = ({ item }) => {
        const announcementId = item._id;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text
                        style={styles.announcementTitle}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>

                    {item.isPinned && (
                        <Text style={styles.pinned}>
                            📌 Pinned
                        </Text>
                    )}
                </View>

                <Text style={styles.content}>
                    {item.content}
                </Text>

                {item.createdAt && (
                    <Text style={styles.date}>
                        {new Date(
                            item.createdAt
                        ).toLocaleDateString()}
                    </Text>
                )}

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate(
                                "EditAnnouncement",
                                {
                                    announcementId:item._id,
                                    communityId,
                                    title: item.title,
                                    content: item.content,
                                }
                            )
                        }
                    >
                        <Text style={styles.editText}>
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                            handleDelete(
                                announcementId
                            )
                        }
                        disabled={
                            deletingId ===
                            announcementId
                        }
                    >
                        {deletingId ===
                        announcementId ? (
                            <ActivityIndicator
                                size="small"
                                color="#D32F2F"
                            />
                        ) : (
                            <Text
                                style={
                                    styles.deleteText
                                }
                            >
                                Delete
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading announcements...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Announcements
                </Text>

                <Text style={styles.subtitle}>
                    Manage announcements for your community
                </Text>
            </View>

            {announcements.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>
                        📢
                    </Text>

                    <Text style={styles.emptyTitle}>
                        No Announcements
                    </Text>

                    <Text style={styles.emptyText}>
                        You haven't created any
                        announcements yet.
                    </Text>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() =>
                            navigation.navigate(
                                "CreateAnnouncement",
                                {
                                    communityId,
                                }
                            )
                        }
                    >
                        <Text
                            style={
                                styles.createButtonText
                            }
                        >
                            Create Announcement
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={announcements}
                    keyExtractor={(item) =>
                        item._id
                    }
                    renderItem={renderAnnouncement}
                    contentContainerStyle={
                        styles.list
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}

            {announcements.length > 0 && (
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() =>
                        navigation.navigate(
                            "CreateAnnouncement",
                            {
                                communityId,
                            }
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
            )}
        </View>
    );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222",
    },

    subtitle: {
        fontSize: 15,
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
        marginBottom: 15,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    announcementTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginRight: 10,
    },

    pinned: {
        fontSize: 12,
        fontWeight: "600",
        color: "#D97706",
    },

    content: {
        fontSize: 16,
        lineHeight: 24,
        color: "#555",
        marginTop: 10,
    },

    date: {
        fontSize: 13,
        color: "#888",
        marginTop: 12,
    },

    actions: {
        flexDirection: "row",
        marginTop: 15,
    },

    editButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#208AEF",
        paddingVertical: 11,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 6,
    },

    editText: {
        color: "#208AEF",
        fontWeight: "700",
        fontSize: 15,
    },

    deleteButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#D32F2F",
        paddingVertical: 11,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 6,
    },

    deleteText: {
        color: "#D32F2F",
        fontWeight: "700",
        fontSize: 15,
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

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 55,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 23,
        fontWeight: "700",
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
        fontSize: 16,
        fontWeight: "700",
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
    },
});