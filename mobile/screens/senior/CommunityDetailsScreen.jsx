import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
    getCommunity,
    joinCommunity,
    leaveCommunity,
} from "../../services/communityService";


const CommunityDetailsScreen = ({
    navigation,
    route,
}) => {

    const insets = useSafeAreaInsets();


    /*
     * MyCommunitiesScreen sends:
     *
     * {
     *     communityId: "...",
     *     isMember: true
     * }
     *
     * For Discover Communities, isMember may not be passed.
     */

    const {
        communityId,
        isMember: initialIsMember = false,
    } = route.params || {};


    const [community, setCommunity] = useState(null);

    const [loading, setLoading] = useState(true);

    const [joining, setJoining] = useState(false);


    /*
     * Load community details
     */

    useEffect(() => {

        loadCommunity();

    }, [communityId]);


    const loadCommunity = async () => {

        try {

            setLoading(true);

            const communityData =
                await getCommunity(communityId);

            console.log(
                "Community Details:",
                communityData
            );


            /*
             * Backend normally returns isMember.
             *
             * If backend returns it, use backend value.
             *
             * If backend doesn't return it, use the value
             * passed from MyCommunitiesScreen.
             */

            const backendIsMember =
                typeof communityData?.isMember === "boolean"
                    ? communityData.isMember
                    : null;


            const finalIsMember =
                backendIsMember !== null
                    ? backendIsMember
                    : initialIsMember;


            setCommunity({
                ...communityData,
                isMember: finalIsMember,
            });


        } catch (error) {

            console.log(
                "Community details error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                "Unable to load community"
            );

        } finally {

            setLoading(false);

        }
    };


    /*
     * JOIN COMMUNITY
     */

    const handleJoin = async () => {

        try {

            setJoining(true);

            await joinCommunity(communityId);


            /*
             * Immediately update UI.
             */

            setCommunity((previous) => ({
                ...previous,

                isMember: true,

                memberCount:
                    (previous?.memberCount || 0) + 1,
            }));


            Alert.alert(
                "Success",
                "You have joined the community."
            );


        } catch (error) {

            console.log(
                "Join community error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Unable to Join",
                error.response?.data?.message ||
                "Something went wrong while joining."
            );

        } finally {

            setJoining(false);

        }
    };


    /*
     * LEAVE COMMUNITY
     */

    const handleLeave = () => {

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

                    onPress: confirmLeave,
                },
            ]
        );
    };


    const confirmLeave = async () => {

        try {

            setJoining(true);

            await leaveCommunity(communityId);


            /*
             * Update UI immediately.
             */

            setCommunity((previous) => ({
                ...previous,

                isMember: false,

                memberCount: Math.max(
                    0,
                    (previous?.memberCount || 1) - 1
                ),
            }));


            Alert.alert(
                "Community Left",
                "You have left this community."
            );


        } catch (error) {

            console.log(
                "Leave community error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Unable to Leave",
                error.response?.data?.message ||
                "Something went wrong while leaving."
            );

        } finally {

            setJoining(false);

        }
    };


    /*
     * OPEN ANNOUNCEMENTS
     */

    const openAnnouncements = () => {

        if (!community?.isMember) {

            Alert.alert(
                "Join Community",
                "Please join this community first."
            );

            return;
        }


        navigation.navigate(
            "CommunityAnnouncements",
            {
                communityId: community._id,
                communityName: community.name,
            }
        );
    };


    /*
     * OPEN DISCUSSION
     */

    const openDiscussion = () => {

        if (!community?.isMember) {

            Alert.alert(
                "Join Community",
                "Please join this community first."
            );

            return;
        }


        navigation.navigate(
            "Discussion",
            {
                communityId: community._id,
                communityName: community.name,
            }
        );
    };


    /*
     * LOADING
     */

    if (loading) {

        return (
            <View
                style={[
                    styles.loader,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color="#0F766E"
                />

            </View>
        );
    }


    /*
     * COMMUNITY NOT FOUND
     */

    if (!community) {

        return (
            <View
                style={[
                    styles.errorContainer,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >

                <Text style={styles.errorText}>
                    Community not found.
                </Text>

            </View>
        );
    }


    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                },
            ]}
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* COMMUNITY HEADER */}

                <View style={styles.headerCard}>

                    <Text style={styles.communityName}>
                        {community.name}
                    </Text>

                    <Text style={styles.category}>
                        {community.category}
                    </Text>

                    <Text style={styles.description}>
                        {community.description}
                    </Text>

                    <Text style={styles.members}>
                        {community.memberCount || 0} members
                    </Text>

                </View>


                {/* JOIN / LEAVE BUTTON */}

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

                    {joining ? (

                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />

                    ) : (

                        <Text style={styles.joinButtonText}>

                            {community.isMember
                                ? "Leave Community"
                                : "Join Community"}

                        </Text>

                    )}

                </TouchableOpacity>


                {/* COMMUNITY ACTIONS */}

                {community.isMember && (

                    <View style={styles.actionsContainer}>

                        {/* ANNOUNCEMENTS */}

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={openAnnouncements}
                        >

                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>
                                    📢
                                </Text>
                            </View>

                            <View style={styles.actionTextContainer}>

                                <Text style={styles.actionTitle}>
                                    Announcements
                                </Text>

                                <Text style={styles.actionSubtitle}>
                                    View community announcements
                                </Text>

                            </View>

                            <Text style={styles.arrow}>
                                →
                            </Text>

                        </TouchableOpacity>


                        {/* DISCUSSION */}

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={openDiscussion}
                        >

                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>
                                    💬
                                </Text>
                            </View>

                            <View style={styles.actionTextContainer}>

                                <Text style={styles.actionTitle}>
                                    Discussion
                                </Text>

                                <Text style={styles.actionSubtitle}>
                                    Chat with community members
                                </Text>

                            </View>

                            <Text style={styles.arrow}>
                                →
                            </Text>

                        </TouchableOpacity>

                    </View>

                )}


                {/* MEMBER STATUS */}

                <View style={styles.statusCard}>

                    <Text style={styles.statusTitle}>
                        Community Status
                    </Text>

                    <Text style={styles.statusText}>

                        {community.isMember
                            ? "✓ You are a member of this community."
                            : "You have not joined this community yet."}

                    </Text>

                </View>

            </ScrollView>

        </View>
    );
};


export default CommunityDetailsScreen;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#E6F7F5",
    },

    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 20,
        paddingBottom: 50,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F7F5",
    },

    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F7F5",
    },

    errorText: {
        fontSize: 18,
        color: "#991B1B",
        fontWeight: "600",
    },

    headerCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 22,
        marginBottom: 18,
        elevation: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },

    communityName: {
        fontSize: 28,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 8,
    },

    category: {
        alignSelf: "flex-start",
        backgroundColor: "#CCFBF1",
        color: "#0F766E",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 15,
    },

    description: {
        fontSize: 17,
        color: "#374151",
        lineHeight: 25,
        marginBottom: 15,
    },

    members: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "600",
    },

    joinButton: {
        backgroundColor: "#0F766E",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        elevation: 3,
    },

    leaveButton: {
        backgroundColor: "#DC2626",
    },

    joinButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    actionsContainer: {
        marginBottom: 20,
    },

    actionCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 17,
        marginBottom: 14,

        flexDirection: "row",
        alignItems: "center",

        elevation: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E6F7F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    icon: {
        fontSize: 25,
    },

    actionTextContainer: {
        flex: 1,
    },

    actionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 4,
    },

    actionSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },

    arrow: {
        fontSize: 25,
        color: "#0F766E",
        fontWeight: "700",
        marginLeft: 8,
    },

    statusCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        marginTop: 5,
        elevation: 2,
    },

    statusTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 8,
    },

    statusText: {
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 22,
    },

});