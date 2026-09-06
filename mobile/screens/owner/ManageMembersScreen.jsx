import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import API from "../../services/api";


const ManageMembersScreen = ({ route, navigation }) => {

    const communityId = route?.params?.communityId;

    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       LOAD MEMBERS
    ===================================================== */
    const loadMembers = async () => {

        if (!communityId) {

            console.log(
                "ERROR: communityId is missing"
            );

            setError(
                "Community ID is missing"
            );

            setLoading(false);

            return;
        }

        try {

            setError("");

            console.log(
                "\n========== LOAD MEMBERS =========="
            );

            console.log(
                "Community ID:",
                communityId
            );

            console.log(
                "Request URL:",
                `/communities/${communityId}/members`
            );

            const response =
                await API.get(
                    `/communities/${communityId}/members`
                );

            console.log(
                "Response status:",
                response.status
            );

            console.log(
                "Response data:",
                response.data
            );

            /*
             * Backend response:
             *
             * {
             *   success: true,
             *   data: [...]
             * }
             */

            const data =
                response.data?.data ||
                response.data?.members ||
                [];

            console.log(
                "Members received:",
                data
            );

            if (Array.isArray(data)) {

                setMembers(data);

            } else {

                console.log(
                    "Members data is not an array"
                );

                setMembers([]);
            }

            console.log(
                "=================================\n"
            );

        } catch (error) {

            console.log(
                "\n========== LOAD MEMBERS ERROR =========="
            );

            console.log(
                "Message:",
                error.message
            );

            console.log(
                "Status:",
                error.response?.status
            );

            console.log(
                "Response:",
                error.response?.data
            );

            console.log(
                "URL:",
                error.config?.url
            );

            console.log(
                "Base URL:",
                error.config?.baseURL
            );

            console.log(
                "=========================================\n"
            );

            setMembers([]);

            setError(
                error.response?.data?.message ||
                `Unable to load members. Status: ${
                    error.response?.status ||
                    "Network Error"
                }`
            );
        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    /* =====================================================
       SCREEN FOCUS
    ===================================================== */
    useFocusEffect(
        useCallback(() => {

            loadMembers();

        }, [communityId])
    );


    /* =====================================================
       REFRESH
    ===================================================== */
    const handleRefresh = () => {

        setRefreshing(true);

        loadMembers();
    };


    /* =====================================================
       REMOVE MEMBER
    ===================================================== */
    const handleRemoveMember = (member) => {

        if (!member?._id) {

            Alert.alert(
                "Error",
                "Member ID is missing"
            );

            return;
        }

        Alert.alert(
            "Remove Member",
            `Are you sure you want to remove ${
                member.name || "this member"
            } from the community?`,

            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Remove",
                    style: "destructive",

                    onPress: async () => {

                        try {

                            console.log(
                                "Removing member:",
                                member._id
                            );

                            const response =
                                await API.delete(
                                    `/communities/${communityId}/members/${member._id}`
                                );

                            console.log(
                                "Remove response:",
                                response.data
                            );

                            Alert.alert(
                                "Success",
                                response.data?.message ||
                                "Member removed successfully"
                            );

                            loadMembers();

                        } catch (error) {

                            console.log(
                                "Remove member error:",
                                error
                            );

                            console.log(
                                "Status:",
                                error.response?.status
                            );

                            console.log(
                                "Response:",
                                error.response?.data
                            );

                            Alert.alert(
                                "Error",
                                error.response?.data?.message ||
                                "Unable to remove member"
                            );
                        }
                    },
                },
            ]
        );
    };


    /* =====================================================
       RENDER MEMBER
    ===================================================== */
    const renderMember = ({ item }) => {

        return (
            <View style={styles.memberCard}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.name
                            ? item.name
                                  .charAt(0)
                                  .toUpperCase()
                            : "U"}
                    </Text>
                </View>


                <View style={styles.memberInfo}>

                    <Text
                        style={styles.memberName}
                    >
                        {item.name || "Unknown User"}
                    </Text>


                    <Text
                        style={styles.memberEmail}
                    >
                        {item.email || "No email"}
                    </Text>


                    {item.joinedAt && (
                        <Text
                            style={styles.joinedText}
                        >
                            Joined:{" "}
                            {new Date(
                                item.joinedAt
                            ).toLocaleDateString()}
                        </Text>
                    )}

                </View>


                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() =>
                        handleRemoveMember(item)
                    }
                >

                    <Text
                        style={styles.removeButtonText}
                    >
                        Remove
                    </Text>

                </TouchableOpacity>

            </View>
        );
    };


    /* =====================================================
       LOADING
    ===================================================== */
    if (loading) {

        return (
            <View style={styles.centerContainer}>

                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />

                <Text style={styles.loadingText}>
                    Loading community members...
                </Text>

            </View>
        );
    }


    /* =====================================================
       MAIN SCREEN
    ===================================================== */
    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() =>
                        navigation.goBack()
                    }
                    style={styles.backButton}
                >
                    <Text
                        style={styles.backButtonText}
                    >
                        ←
                    </Text>
                </TouchableOpacity>


                <View>

                    <Text
                        style={styles.title}
                    >
                        Community Members
                    </Text>

                    <Text
                        style={styles.subtitle}
                    >
                        {members.length}{" "}
                        {members.length === 1
                            ? "Member"
                            : "Members"}
                    </Text>

                </View>

            </View>


            {/* ERROR */}
            {error ? (
                <View style={styles.errorContainer}>

                    <Text
                        style={styles.errorTitle}
                    >
                        Unable to load members
                    </Text>

                    <Text
                        style={styles.errorText}
                    >
                        {error}
                    </Text>


                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {

                            setLoading(true);

                            loadMembers();

                        }}
                    >

                        <Text
                            style={styles.retryText}
                        >
                            Try Again
                        </Text>

                    </TouchableOpacity>

                </View>
            ) : null}


            {/* MEMBERS */}
            {!error && (
                <FlatList
                    data={members}
                    keyExtractor={(item, index) =>
                        item?._id?.toString() ||
                        index.toString()
                    }
                    renderItem={renderMember}
                    contentContainerStyle={
                        members.length === 0
                            ? styles.emptyContainer
                            : styles.listContainer
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
                                styles.emptyContainer
                            }
                        >

                            <Text
                                style={
                                    styles.emptyIcon
                                }
                            >
                                👥
                            </Text>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                No Members Yet
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                No one has joined this
                                community yet.
                            </Text>

                        </View>
                    }
                />
            )}

        </View>
    );
};


export default ManageMembersScreen;


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#64748B",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 55,
        paddingBottom: 18,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    backButtonText: {
        fontSize: 25,
        color: "#2563EB",
    },

    title: {
        fontSize: 21,
        fontWeight: "700",
        color: "#0F172A",
    },

    subtitle: {
        marginTop: 3,
        fontSize: 14,
        color: "#64748B",
    },

    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },

    memberCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 14,
        marginBottom: 12,
        elevation: 2,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarText: {
        fontSize: 21,
        fontWeight: "700",
        color: "#2563EB",
    },

    memberInfo: {
        flex: 1,
    },

    memberName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 3,
    },

    memberEmail: {
        fontSize: 13,
        color: "#64748B",
    },

    joinedText: {
        marginTop: 4,
        fontSize: 12,
        color: "#94A3B8",
    },

    removeButton: {
        backgroundColor: "#FEE2E2",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },

    removeButtonText: {
        color: "#DC2626",
        fontSize: 13,
        fontWeight: "700",
    },

    errorContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: "#FEF2F2",
        borderRadius: 14,
        alignItems: "center",
    },

    errorTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#B91C1C",
        marginBottom: 8,
        textAlign: "center",
    },

    errorText: {
        fontSize: 14,
        color: "#7F1D1D",
        textAlign: "center",
        lineHeight: 20,
    },

    retryButton: {
        marginTop: 15,
        backgroundColor: "#DC2626",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },

    retryText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    emptyContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },

    emptyIcon: {
        fontSize: 55,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 21,
    },

});