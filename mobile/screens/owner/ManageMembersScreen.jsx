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

const ManageMembersScreen = ({ route }) => {
    const { communityId } = route.params;

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");

    const loadMembers = async () => {
        try {
            setError("");

            const response = await API.get(
                `/communities/${communityId}/members`
            );

            const data =
                response.data.members || response.data;

            setMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Load members error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load community members."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, [communityId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadMembers();
    };

    const handleRemoveMember = (member) => {
        const memberName =
            member.name ||
            member.user?.name ||
            "this member";

        const memberId =
            member._id ||
            member.user?._id;

        Alert.alert(
            "Remove Member",
            `Are you sure you want to remove ${memberName} from this community?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () =>
                        removeMember(memberId),
                },
            ]
        );
    };

    const removeMember = async (memberId) => {
        try {
            setRemovingId(memberId);

            await API.delete(
                `/communities/${communityId}/members/${memberId}`
            );

            setMembers((currentMembers) =>
                currentMembers.filter(
                    (member) =>
                        (member._id ||
                            member.user?._id) !== memberId
                )
            );

            Alert.alert(
                "Success",
                "Member removed successfully."
            );
        } catch (error) {
            console.log(
                "Remove member error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to remove member."
            );
        } finally {
            setRemovingId(null);
        }
    };

    const renderMember = ({ item }) => {
        const member =
            item.user || item;

        const memberId =
            item._id ||
            item.user?._id;

        return (
            <View style={styles.memberCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {member.name
                            ? member.name
                                  .charAt(0)
                                  .toUpperCase()
                            : "?"}
                    </Text>
                </View>

                <View style={styles.memberInfo}>
                    <Text
                        style={styles.memberName}
                        numberOfLines={1}
                    >
                        {member.name ||
                            "Unknown Member"}
                    </Text>

                    <Text
                        style={styles.memberEmail}
                        numberOfLines={1}
                    >
                        {member.email ||
                            "Email not available"}
                    </Text>

                    <Text style={styles.memberRole}>
                        Senior Citizen
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() =>
                        handleRemoveMember(item)
                    }
                    disabled={removingId === memberId}
                >
                    {removingId === memberId ? (
                        <ActivityIndicator
                            size="small"
                            color="#D32F2F"
                        />
                    ) : (
                        <Text style={styles.removeText}>
                            Remove
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading members...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadMembers}
                >
                    <Text style={styles.retryText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Manage Members
                </Text>

                <Text style={styles.subtitle}>
                    {members.length}{" "}
                    {members.length === 1
                        ? "member"
                        : "members"}{" "}
                    joined
                </Text>
            </View>

            {members.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>
                        👥
                    </Text>

                    <Text style={styles.emptyTitle}>
                        No Members Yet
                    </Text>

                    <Text style={styles.emptyText}>
                        No senior citizens have joined
                        this community yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) =>
                        item._id ||
                        item.user?._id
                    }
                    renderItem={renderMember}
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
        </View>
    );
};

export default ManageMembersScreen;

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
        fontSize: 16,
        color: "#666",
        marginTop: 6,
    },

    list: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    memberCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#E8F2FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    avatarText: {
        fontSize: 21,
        fontWeight: "700",
        color: "#208AEF",
    },

    memberInfo: {
        flex: 1,
        marginRight: 10,
    },

    memberName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
    },

    memberEmail: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },

    memberRole: {
        fontSize: 13,
        color: "#208AEF",
        marginTop: 4,
        fontWeight: "600",
    },

    removeButton: {
        borderWidth: 1,
        borderColor: "#D32F2F",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 9,
        minWidth: 72,
        alignItems: "center",
    },

    removeText: {
        color: "#D32F2F",
        fontSize: 13,
        fontWeight: "700",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        backgroundColor: "#F7F9FC",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#555",
    },

    errorText: {
        fontSize: 16,
        color: "#D32F2F",
        textAlign: "center",
        marginBottom: 20,
    },

    retryButton: {
        backgroundColor: "#208AEF",
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
    },

    retryText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
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
    },
});