import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";

import {
    getCommunity,
    joinCommunity,
    leaveCommunity,
} from "../../services/communityService";

const CommunityDetailsScreen = ({ route, navigation }) => {

    const { communityId } = route.params;

    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        loadCommunity();
    }, []);

    const loadCommunity = async () => {
        try {
            setLoading(true);

            const communityData =
                await getCommunity(communityId);

            setCommunity(
                communityData.community ||
                communityData
            );

        } catch (error) {
            console.log(
                "Load community error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                "Unable to load community details."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            setJoining(true);

            await joinCommunity(communityId);

            Alert.alert(
                "Success",
                "You joined the community."
            );

            await loadCommunity();

        } catch (error) {
            console.log(
                "Join community error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                "Unable to join community."
            );

        } finally {
            setJoining(false);
        }
    };

    const handleLeave = async () => {
        Alert.alert(
            "Leave Community",
            "Are you sure you want to leave this community?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Leave",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setJoining(true);

                            await leaveCommunity(
                                communityId
                            );

                            Alert.alert(
                                "Success",
                                "You left the community."
                            );

                            await loadCommunity();

                        } catch (error) {
                            console.log(
                                "Leave community error:",
                                error.response?.data ||
                                error.message
                            );

                            Alert.alert(
                                "Error",
                                error.response?.data?.message ||
                                "Unable to leave community."
                            );

                        } finally {
                            setJoining(false);
                        }
                    },
                },
            ]
        );
    };

    const openAnnouncements = () => {
        navigation.navigate(
            "CommunityAnnouncements",
            {
                communityId,
                communityName: community.name,
            }
        );
    };

    const openDiscussion = () => {
        navigation.navigate(
            "Discussion",
            {
                communityId,
                communityName: community.name,
            }
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />

                <Text style={styles.loadingText}>
                    Loading community...
                </Text>
            </View>
        );
    }

    if (!community) {
        return (
            <View style={styles.loader}>
                <Text style={styles.errorText}>
                    Community not found.
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadCommunity}
                >
                    <Text style={styles.buttonText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
        >

            {/* Community Name */}

            <Text style={styles.name}>
                {community.name}
            </Text>

            {/* Category */}

            {community.category ? (
                <Text style={styles.category}>
                    {community.category}
                </Text>
            ) : null}

            {/* Description */}

            <Text style={styles.description}>
                {community.description ||
                    "No description available."}
            </Text>

            {/* Members */}

            <Text style={styles.members}>
                {community.memberCount || 0} members
            </Text>

            {/* Join / Leave Button */}

            <TouchableOpacity
                style={[
                    styles.joinButton,
                    community.isMember &&
                        styles.leaveButton,
                ]}
                onPress={
                    community.isMember
                        ? handleLeave
                        : handleJoin
                }
                disabled={joining}
            >
                <Text style={styles.buttonText}>
                    {joining
                        ? "Please wait..."
                        : community.isMember
                        ? "Leave Community"
                        : "Join Community"}
                </Text>
            </TouchableOpacity>

            {/* Announcements */}

            {community.isMember && (
                <TouchableOpacity
                    style={styles.announcementButton}
                    onPress={openAnnouncements}
                >
                    <Text style={styles.buttonText}>
                        📢 View Announcements
                    </Text>
                </TouchableOpacity>
            )}

            {/* Discussion */}

            {community.isMember && (
                <TouchableOpacity
                    style={styles.discussionButton}
                    onPress={openDiscussion}
                >
                    <Text style={styles.buttonText}>
                        💬 Open Discussion
                    </Text>
                </TouchableOpacity>
            )}

        </ScrollView>
    );
};

export default CommunityDetailsScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },

    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
        padding: 20,
    },

    loadingText: {
        marginTop: 10,
        fontSize: 15,
        color: "#6B7280",
    },

    errorText: {
        fontSize: 17,
        color: "#DC2626",
        marginBottom: 20,
        textAlign: "center",
    },

    name: {
        fontSize: 30,
        fontWeight: "700",
        color: "#111827",
    },

    category: {
        fontSize: 17,
        color: "#2563EB",
        marginTop: 6,
        fontWeight: "600",
    },

    description: {
        fontSize: 17,
        lineHeight: 25,
        color: "#374151",
        marginTop: 20,
    },

    members: {
        fontSize: 16,
        color: "#6B7280",
        marginTop: 15,
    },

    joinButton: {
        backgroundColor: "#2563EB",
        padding: 17,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 25,
    },

    leaveButton: {
        backgroundColor: "#DC2626",
    },

    announcementButton: {
        backgroundColor: "#F59E0B",
        padding: 17,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },

    discussionButton: {
        backgroundColor: "#16A34A",
        padding: 17,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },

    retryButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 10,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
    },

});