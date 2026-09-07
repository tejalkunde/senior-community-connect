import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "../../context/authcontext";

import API from "../../services/api";


const OwnerDashboardScreen = ({ navigation }) => {

    const { user } = useAuth();

    const insets = useSafeAreaInsets();

    const [communities, setCommunities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async (
        showLoader = true
    ) => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            const response = await API.get(
                "/communities/my"
            );

            console.log(
                "Owner communities response:",
                response.data
            );

            const data =
                response.data?.data ||
                response.data?.communities ||
                response.data ||
                [];

            setCommunities(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(
                "Owner dashboard error:",
                error.response?.data ||
                error.message
            );

            setCommunities([]);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD WHEN SCREEN OPENS / COMES BACK INTO FOCUS
    // =====================================================

    useFocusEffect(
        useCallback(() => {

            loadDashboard(false);

        }, [])
    );


    // =====================================================
    // PULL TO REFRESH
    // =====================================================

    const handleRefresh = async () => {

        try {

            setRefreshing(true);

            await loadDashboard(false);

        } finally {

            setRefreshing(false);

        }
    };


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalCommunities =
        communities.length;


    const totalMembers =
        communities.reduce(
            (total, community) =>
                total +
                (community.memberCount || 0),
            0
        );


    // =====================================================
    // UI
    // =====================================================

    return (

        <View style={styles.safeArea}>

            <ScrollView

                showsVerticalScrollIndicator={false}

                contentContainerStyle={[
                    styles.container,
                    {
                        paddingTop:
                            insets.top + 20,

                        paddingBottom:
                            insets.bottom + 100,
                    },
                ]}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }

            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>

                    <View
                        style={styles.headerContent}
                    >

                        <Text
                            style={styles.name}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {user?.name || "Owner"} 👋
                        </Text>

                        <Text
                            style={styles.subtitle}
                        >
                            Manage your communities
                            and stay connected.
                        </Text>

                    </View>


                    <View
                        style={styles.ownerIcon}
                    >

                        <Text
                            style={styles.ownerIconText}
                        >
                            👤
                        </Text>

                    </View>

                </View>


                {/* =================================================
                    ROLE BADGE
                ================================================= */}

                <View
                    style={styles.roleBadge}
                >

                    <Text
                        style={styles.roleIcon}
                    >
                        🏠
                    </Text>

                    <Text
                        style={styles.roleText}
                    >
                        Community Owner
                    </Text>

                </View>


                {/* =================================================
                    OVERVIEW
                ================================================= */}

                <Text
                    style={styles.sectionTitle}
                >
                    Your Overview
                </Text>


                {loading ? (

                    <View
                        style={styles.loadingCard}
                    >

                        <ActivityIndicator
                            size="large"
                        />

                        <Text
                            style={styles.loadingText}
                        >
                            Loading statistics...
                        </Text>

                    </View>

                ) : (

                    <View
                        style={styles.statsContainer}
                    >

                        {/* =========================================
                            COMMUNITIES
                        ========================================== */}

                        <View
                            style={styles.statCard}
                        >

                            <View
                                style={[
                                    styles.statIcon,
                                    styles.communityIcon,
                                ]}
                            >

                                <Text
                                    style={styles.iconText}
                                >
                                    👥
                                </Text>

                            </View>


                            <Text
                                style={styles.statNumber}
                            >
                                {totalCommunities}
                            </Text>


                            <Text
                                style={styles.statLabel}
                            >
                                Communities
                            </Text>

                        </View>


                        {/* =========================================
                            MEMBERS
                        ========================================== */}

                        <View
                            style={styles.statCard}
                        >

                            <View
                                style={[
                                    styles.statIcon,
                                    styles.memberIcon,
                                ]}
                            >

                                <Text
                                    style={styles.iconText}
                                >
                                    ❤️
                                </Text>

                            </View>


                            <Text
                                style={styles.statNumber}
                            >
                                {totalMembers}
                            </Text>


                            <Text
                                style={styles.statLabel}
                            >
                                Total Members
                            </Text>

                        </View>

                    </View>

                )}


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <Text
                    style={styles.sectionTitle}
                >
                    Quick Actions
                </Text>


                {/* =================================================
                    CREATE COMMUNITY
                ================================================= */}

                <TouchableOpacity
                    style={styles.createCard}
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(
                            "CreateCommunity"
                        )
                    }
                >

                    <View
                        style={styles.actionIcon}
                    >

                        <Text
                            style={styles.actionIconText}
                        >
                            ➕
                        </Text>

                    </View>


                    <View
                        style={styles.actionContent}
                    >

                        <Text
                            style={styles.actionTitle}
                        >
                            Create Community
                        </Text>


                        <Text
                            style={styles.actionText}
                        >
                            Create a new community
                            for senior citizens.
                        </Text>

                    </View>


                    <Text
                        style={styles.arrow}
                    >
                        ›
                    </Text>

                </TouchableOpacity>


                {/* =================================================
                    MANAGE COMMUNITIES
                ================================================= */}

                <TouchableOpacity
                    style={styles.manageCard}
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(
                            "OwnerMyCommunities"
                        )
                    }
                >

                    <View
                        style={styles.actionIcon}
                    >

                        <Text
                            style={styles.actionIconText}
                        >
                            👥
                        </Text>

                    </View>


                    <View
                        style={styles.actionContent}
                    >

                        <Text
                            style={styles.actionTitle}
                        >
                            Manage Communities
                        </Text>


                        <Text
                            style={styles.actionText}
                        >
                            View your communities,
                            members and activities.
                        </Text>

                    </View>


                    <Text
                        style={styles.arrow}
                    >
                        ›
                    </Text>

                </TouchableOpacity>


                {/* =================================================
                    ANNOUNCEMENTS
                ================================================= */}

                <TouchableOpacity
                    style={styles.announcementCard}
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(
                            "Announcements"
                        )
                    }
                >

                    <View
                        style={styles.actionIcon}
                    >

                        <Text
                            style={styles.actionIconText}
                        >
                            📢
                        </Text>

                    </View>


                    <View
                        style={styles.actionContent}
                    >

                        <Text
                            style={styles.actionTitle}
                        >
                            Announcements
                        </Text>


                        <Text
                            style={styles.actionText}
                        >
                            Create and manage
                            community announcements.
                        </Text>

                    </View>


                    <Text
                        style={styles.arrow}
                    >
                        ›
                    </Text>

                </TouchableOpacity>


                {/* =================================================
                    INFORMATION CARD
                ================================================= */}

                <View
                    style={styles.infoCard}
                >

                    <Text
                        style={styles.infoIcon}
                    >
                        💡
                    </Text>


                    <View
                        style={styles.infoContent}
                    >

                        <Text
                            style={styles.infoTitle}
                        >
                            Community Tip
                        </Text>


                        <Text
                            style={styles.infoText}
                        >
                            Keep your members engaged
                            by regularly sharing useful
                            announcements and updates.
                        </Text>

                    </View>

                </View>


            </ScrollView>

        </View>

    );

};


export default OwnerDashboardScreen;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    // =================================================
    // MAIN
    // =================================================

    safeArea: {
        flex: 1,
        backgroundColor: "#F3F0FF",
    },


    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 18,
    },


    headerContent: {
        flex: 1,
        minWidth: 0,
        paddingRight: 8,
    },


    name: {
        fontSize: 26,
        fontWeight: "800",
        color: "#433878",
        lineHeight: 34,
        flexShrink: 1,
    },


    subtitle: {
        fontSize: 16,
        color: "#5B556F",
        marginTop: 6,
        lineHeight: 23,
        flexShrink: 1,
    },


    ownerIcon: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: "#DDD6FE",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        flexShrink: 0,
    },


    ownerIconText: {
        fontSize: 31,
    },


    // =================================================
    // ROLE BADGE
    // =================================================

    roleBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#E9E3FF",
        paddingHorizontal: 15,
        paddingVertical: 9,
        borderRadius: 20,
        marginBottom: 25,
    },


    roleIcon: {
        fontSize: 18,
        marginRight: 7,
    },


    roleText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#6B5B95",
    },


    // =================================================
    // SECTION TITLE
    // =================================================

    sectionTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 13,
    },


    // =================================================
    // LOADING
    // =================================================

    loadingCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 25,
        alignItems: "center",
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#DDD6FE",
    },


    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#6B5B95",
    },


    // =================================================
    // STATISTICS
    // =================================================

    statsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 25,
    },


    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#DDD6FE",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },


    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },


    communityIcon: {
        backgroundColor: "#E0E7FF",
    },


    memberIcon: {
        backgroundColor: "#FCE7F3",
    },


    iconText: {
        fontSize: 25,
    },


    statNumber: {
        fontSize: 28,
        fontWeight: "800",
        color: "#433878",
    },


    statLabel: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 3,
    },


    // =================================================
    // ACTION CARDS
    // =================================================

    createCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EDE9FE",
        borderRadius: 16,
        padding: 17,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#DDD6FE",
    },


    manageCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E0F2FE",
        borderRadius: 16,
        padding: 17,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#BAE6FD",
    },


    announcementCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 17,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#FDE68A",
    },


    actionIcon: {
        width: 52,
        height: 52,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginRight: 13,
        flexShrink: 0,
    },


    actionIconText: {
        fontSize: 27,
    },


    actionContent: {
        flex: 1,
        minWidth: 0,
    },


    actionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },


    actionText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#4B5563",
        marginTop: 4,
    },


    arrow: {
        fontSize: 30,
        color: "#6B7280",
        marginLeft: 8,
        flexShrink: 0,
    },


    // =================================================
    // INFORMATION CARD
    // =================================================

    infoCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#DDD6FE",
        marginBottom: 20,
    },


    infoIcon: {
        fontSize: 30,
        marginRight: 13,
    },


    infoContent: {
        flex: 1,
        minWidth: 0,
    },


    infoTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#433878",
    },


    infoText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#5B556F",
        marginTop: 5,
    },

});