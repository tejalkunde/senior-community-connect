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
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
    getCommunity,
    joinCommunity,
    leaveCommunity,
} from "../../services/communityService";

const CommunityDetailsScreen = ({
    route,
    navigation,
}) => {

    const {
        communityId,
    } = route.params;

    const insets = useSafeAreaInsets();

    const [community, setCommunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [joining, setJoining] =
        useState(false);

    useEffect(() => {
        loadCommunity();
    }, []);

    const loadCommunity = async () => {

        try {

            setLoading(true);

            const communityData =
                await getCommunity(
                    communityId
                );

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


    /* JOIN COMMUNITY */

    const handleJoin = async () => {

        try {

            setJoining(true);

            await joinCommunity(
                communityId
            );

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


    /* LEAVE COMMUNITY */

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


    /* OPEN ANNOUNCEMENTS */

    const openAnnouncements = () => {

        navigation.navigate(
            "CommunityAnnouncements",
            {
                communityId,
                communityName:
                    community.name,
            }
        );
    };


    /* OPEN DISCUSSION */

    const openDiscussion = () => {

        navigation.navigate(
            "Discussion",
            {
                communityId,
                communityName:
                    community.name,
            }
        );
    };


    /* LOADING */

    if (loading) {

        return (
            <View
                style={[
                    styles.loader,
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
                    color="#0F766E"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading community...
                </Text>

            </View>
        );
    }


    /* COMMUNITY NOT FOUND */

    if (!community) {

        return (
            <View
                style={[
                    styles.loader,
                    {
                        paddingTop:
                            insets.top,
                        paddingBottom:
                            insets.bottom,
                    },
                ]}
            >

                <Text
                    style={
                        styles.errorIcon
                    }
                >
                    ⚠️
                </Text>

                <Text
                    style={
                        styles.errorText
                    }
                >
                    Community not found.
                </Text>

                <TouchableOpacity
                    style={
                        styles.retryButton
                    }
                    activeOpacity={0.8}
                    onPress={loadCommunity}
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
        <ScrollView
            style={styles.container}

            contentContainerStyle={[
                styles.contentContainer,
                {
                    paddingTop:
                        insets.top + 20,

                    paddingBottom:
                        insets.bottom + 40,
                },
            ]}

            showsVerticalScrollIndicator={
                false
            }
        >

            {/* COMMUNITY HEADER */}

            <View style={styles.headerCard}>

                <View style={styles.communityIcon}>

                    <Text
                        style={
                            styles.communityIconText
                        }
                    >
                        👥
                    </Text>

                </View>

                <Text style={styles.name}>
                    {community.name}
                </Text>

                {community.category ? (

                    <View style={styles.categoryBadge}>

                        <Text
                            style={
                                styles.category
                            }
                        >
                            {community.category}
                        </Text>

                    </View>

                ) : null}

            </View>


            {/* DESCRIPTION */}

            <View style={styles.infoCard}>

                <Text
                    style={
                        styles.sectionTitle
                    }
                >
                    About This Community
                </Text>

                <Text
                    style={
                        styles.description
                    }
                >
                    {community.description ||
                        "No description available."}
                </Text>

            </View>


            {/* MEMBERS */}

            <View style={styles.membersCard}>

                <Text style={styles.memberIcon}>
                    👥
                </Text>

                <View>

                    <Text
                        style={
                            styles.memberCount
                        }
                    >
                        {community.memberCount ||
                            0}
                    </Text>

                    <Text
                        style={
                            styles.memberLabel
                        }
                    >
                        Community Members
                    </Text>

                </View>

            </View>


            {/* JOIN / LEAVE */}

            <TouchableOpacity
                style={[
                    styles.joinButton,
                    community.isMember &&
                    styles.leaveButton,
                ]}
                activeOpacity={0.8}
                onPress={
                    community.isMember
                        ? handleLeave
                        : handleJoin
                }
                disabled={joining}
            >

                <Text
                    style={
                        styles.buttonText
                    }
                >
                    {joining
                        ? "Please wait..."
                        : community.isMember
                        ? "Leave Community"
                        : "Join Community"}
                </Text>

            </TouchableOpacity>


            {/* MEMBER ACTIONS */}

            {community.isMember && (

                <View style={styles.actionsContainer}>

                    {/* ANNOUNCEMENTS */}

                    <TouchableOpacity
                        style={
                            styles.announcementButton
                        }
                        activeOpacity={0.8}
                        onPress={
                            openAnnouncements
                        }
                    >

                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            📢
                        </Text>

                        <View
                            style={
                                styles.actionContent
                            }
                        >

                            <Text
                                style={
                                    styles.actionTitle
                                }
                            >
                                Announcements
                            </Text>

                            <Text
                                style={
                                    styles.actionText
                                }
                            >
                                View community
                                announcements
                            </Text>

                        </View>

                        <Text
                            style={
                                styles.arrow
                            }
                        >
                            ›
                        </Text>

                    </TouchableOpacity>


                    {/* DISCUSSION */}

                    <TouchableOpacity
                        style={
                            styles.discussionButton
                        }
                        activeOpacity={0.8}
                        onPress={
                            openDiscussion
                        }
                    >

                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            💬
                        </Text>

                        <View
                            style={
                                styles.actionContent
                            }
                        >

                            <Text
                                style={
                                    styles.actionTitle
                                }
                            >
                                Discussion
                            </Text>

                            <Text
                                style={
                                    styles.actionText
                            }
                            >
                                Talk with community
                                members
                            </Text>

                        </View>

                        <Text
                            style={
                                styles.arrow
                            }
                        >
                            ›
                        </Text>

                    </TouchableOpacity>

                </View>
            )}

        </ScrollView>
    );
};

export default CommunityDetailsScreen;


const styles = StyleSheet.create({

    /* MAIN */

    container: {
        flex: 1,
        backgroundColor: "#E6F7F5",
    },

    contentContainer: {
        paddingHorizontal: 20,
    },


    /* LOADING */

    loader: {
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


    /* ERROR */

    errorIcon: {
        fontSize: 45,
        marginBottom: 12,
    },

    errorText: {
        fontSize: 18,
        color: "#B42318",
        marginBottom: 20,
        textAlign: "center",
    },

    retryButton: {
        backgroundColor: "#0F766E",

        paddingHorizontal: 28,
        paddingVertical: 15,

        borderRadius: 12,
    },

    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },


    /* HEADER CARD */

    headerCard: {
        backgroundColor: "#DFF6F2",

        borderRadius: 20,

        padding: 25,

        alignItems: "center",

        borderWidth: 1,
        borderColor: "#B7E4DF",

        marginBottom: 18,
    },

    communityIcon: {
        width: 75,
        height: 75,

        borderRadius: 23,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#B7E4DF",

        marginBottom: 15,
    },

    communityIconText: {
        fontSize: 38,
    },

    name: {
        fontSize: 29,
        fontWeight: "700",
        color: "#155E75",
        textAlign: "center",
    },

    categoryBadge: {
        backgroundColor: "#CCFBF1",

        paddingHorizontal: 16,
        paddingVertical: 7,

        borderRadius: 20,

        marginTop: 10,
    },

    category: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F766E",
    },


    /* DESCRIPTION */

    infoCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        padding: 20,

        marginBottom: 15,

        borderWidth: 1,
        borderColor: "#B7E4DF",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 10,
    },

    description: {
        fontSize: 17,
        lineHeight: 26,
        color: "#374151",
    },


    /* MEMBERS */

    membersCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        padding: 18,

        marginBottom: 20,

        borderWidth: 1,
        borderColor: "#B7E4DF",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    memberIcon: {
        fontSize: 32,
        marginRight: 15,
    },

    memberCount: {
        fontSize: 22,
        fontWeight: "700",
        color: "#155E75",
    },

    memberLabel: {
        fontSize: 15,
        color: "#557A62",
        marginTop: 2,
    },


    /* JOIN */

    joinButton: {
        backgroundColor: "#0F766E",

        paddingVertical: 17,

        borderRadius: 13,

        alignItems: "center",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4,

        marginBottom: 20,
    },

    leaveButton: {
        backgroundColor: "#FDECEC",

        borderWidth: 1,
        borderColor: "#F5C2C2",
    },

    buttonText: {
        color: "#111111",
        fontSize: 17,
        fontWeight: "700",
    },


    /* ACTIONS */

    actionsContainer: {
        marginTop: 0,
    },

    announcementButton: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FEF3C7",

        borderRadius: 16,

        padding: 17,

        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#FDE68A",
    },

    discussionButton: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#DCFCE7",

        borderRadius: 16,

        padding: 17,

        borderWidth: 1,
        borderColor: "#BBF7D0",
    },

    actionIcon: {
        fontSize: 28,

        width: 50,
        textAlign: "center",

        marginRight: 10,
    },

    actionContent: {
        flex: 1,
    },

    actionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },

    actionText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#161717",
        marginTop: 3,
    },

    arrow: {
        fontSize: 30,
        color: "#6B7280",
        marginLeft: 8,
    },

});