import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";

import API from "../../services/api";

const ManageCommunityScreen = ({ route, navigation }) => {
    const { communityId } = route.params;

    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const loadCommunity = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                `/communities/${communityId}`
            );

            setCommunity(
                response.data.community || response.data
            );
        } catch (error) {
            console.log("Load community error:", error);

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to load community."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCommunity();
    }, [communityId]);

    const handleDelete = () => {
        Alert.alert(
            "Delete Community",
            "Are you sure you want to delete this community? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: deleteCommunity,
                },
            ]
        );
    };

    const deleteCommunity = async () => {
        try {
            setDeleting(true);

            await API.delete(
                `/communities/${communityId}`
            );

            Alert.alert(
                "Deleted",
                "Community deleted successfully.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.navigate(
                                "OwnerMyCommunities"
                            );
                        },
                    },
                ]
            );
        } catch (error) {
            console.log(
                "Delete community error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to delete community."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.loadingText}>
                    Loading...
                </Text>
            </View>
        );
    }

    if (!community) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    Community not found.
                </Text>
            </View>
        );
    }

    const status = community.status || "PENDING";

    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>
                Manage Community
            </Text>

            {/* Community Details */}
            <View style={styles.card}>
                <Text style={styles.communityName}>
                    {community.name}
                </Text>

                <Text style={styles.description}>
                    {community.description}
                </Text>

                <Text style={styles.category}>
                    Category: {community.category}
                </Text>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>
                        Status:
                    </Text>

                    <Text
                        style={[
                            styles.status,
                            status === "APPROVED" &&
                                styles.approved,
                            status === "REJECTED" &&
                                styles.rejected,
                            status === "PENDING" &&
                                styles.pending,
                        ]}
                    >
                        {status}
                    </Text>
                </View>
            </View>

            {/* Pending / Rejected */}
            {status !== "APPROVED" && (
                <>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            {status === "PENDING"
                                ? "Your community is waiting for admin approval."
                                : "This community was rejected by the admin."}
                        </Text>
                    </View>

                    {/* Edit Community */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate(
                                "EditCommunity",
                                {
                                    communityId,
                                }
                            )
                        }
                    >
                        <Text style={styles.editButtonText}>
                            Edit Community
                        </Text>
                    </TouchableOpacity>

                    {/* Delete Community */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        disabled={deleting}
                    >
                        <Text style={styles.deleteButtonText}>
                            {deleting
                                ? "Deleting..."
                                : "Delete Community"}
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Approved */}
            {status === "APPROVED" && (
                <>
                    {/* Edit */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate(
                                "EditCommunity",
                                {
                                    communityId,
                                }
                            )
                        }
                    >
                        <Text style={styles.editButtonText}>
                            Edit Community
                        </Text>
                    </TouchableOpacity>

                    {/* Announcement */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            navigation.navigate(
                                "CreateAnnouncement",
                                {
                                    communityId,
                                }
                            )
                        }
                    >
                        <Text style={styles.buttonText}>
                            Create Announcement
                        </Text>
                    </TouchableOpacity>

                    {/* Members */}
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                         navigation.navigate("ManageMembers", {
                           communityId,
                       })
                        }}
                    >
                        <Text
                            style={
                                styles.secondaryButtonText
                            }
                        >
                            Manage Members
                        </Text>
                    </TouchableOpacity>

                    {/* Delete */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        disabled={deleting}
                    >
                        <Text style={styles.deleteButtonText}>
                            {deleting
                                ? "Deleting..."
                                : "Delete Community"}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#F7F9FC",
        flexGrow: 1,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FC",
    },

    loadingText: {
        fontSize: 18,
        color: "#555",
    },

    errorText: {
        fontSize: 18,
        color: "red",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#222",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
    },

    communityName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 12,
    },

    description: {
        fontSize: 17,
        lineHeight: 25,
        color: "#555",
        marginBottom: 15,
    },

    category: {
        fontSize: 16,
        color: "#555",
        marginBottom: 15,
    },

    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusLabel: {
        fontSize: 17,
        fontWeight: "600",
        marginRight: 8,
    },

    status: {
        fontSize: 16,
        fontWeight: "bold",
    },

    approved: {
        color: "green",
    },

    rejected: {
        color: "red",
    },

    pending: {
        color: "#D97706",
    },

    editButton: {
        backgroundColor: "#208AEF",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 12,
    },

    editButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    button: {
        backgroundColor: "#208AEF",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 12,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    secondaryButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#208AEF",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 12,
    },

    secondaryButtonText: {
        color: "#208AEF",
        fontSize: 18,
        fontWeight: "bold",
    },

    deleteButton: {
        backgroundColor: "#D32F2F",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },

    deleteButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    infoBox: {
        backgroundColor: "#FFF7E6",
        padding: 18,
        borderRadius: 10,
        marginBottom: 20,
    },

    infoText: {
        fontSize: 17,
        lineHeight: 25,
        color: "#664D03",
    },
});

export default ManageCommunityScreen;