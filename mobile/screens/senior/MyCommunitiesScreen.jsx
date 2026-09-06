
import React, { useCallback, useState } from "react";

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CommunityCard from "../../components/CommunityCard";

import {
    getMyCommunities,
} from "../../services/communityService";


const MyCommunitiesScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD MY COMMUNITIES
    // =====================================================

    const loadMyCommunities = async () => {

        try {

            setLoading(true);

            const data = await getMyCommunities();

            console.log(
                "My Communities API Data:",
                data
            );


            /*
             * Backend now returns:
             *
             * [
             *   {
             *      _id: "...",
             *      name: "Morning Walkers",
             *      description: "...",
             *      category: "FITNESS",
             *      memberCount: 1,
             *      isMember: true,
             *      joinedAt: "..."
             *   }
             * ]
             *
             *
             * But this also supports the OLD format:
             *
             * [
             *   {
             *      _id: "...",
             *      community: {
             *          _id: "...",
             *          name: "Morning Walkers",
             *          ...
             *      },
             *      joinedAt: "..."
             *   }
             * ]
             */


            const communityList = Array.isArray(data)
                ? data
                    .map((item) => {

                        /*
                         * NEW FORMAT
                         * item itself is the community
                         */

                        if (
                            item?.name &&
                            item?._id
                        ) {

                            return {
                                ...item,

                                isMember: true,

                                joinedAt:
                                    item.joinedAt ||
                                    item.createdAt,
                            };
                        }


                        /*
                         * OLD FORMAT
                         * community is inside membership
                         */

                        if (
                            item?.community
                        ) {

                            return {
                                ...item.community,

                                isMember: true,

                                joinedAt:
                                    item.joinedAt ||
                                    item.createdAt,

                                /*
                                 * If memberCount already exists,
                                 * preserve it.
                                 */
                                memberCount:
                                    item.community.memberCount ??
                                    item.memberCount ??
                                    0,
                            };
                        }


                        return null;

                    })
                    .filter(Boolean)
                : [];


            console.log(
                "Formatted My Communities:",
                communityList
            );


            setCommunities(
                communityList
            );

        } catch (error) {

            console.log(
                "My Communities error:",
                error.response?.data ||
                error.message
            );

            setCommunities([]);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // RELOAD WHEN SCREEN GETS FOCUS
    // =====================================================

    useFocusEffect(
        useCallback(() => {

            loadMyCommunities();

        }, [])
    );


    // =====================================================
    // OPEN COMMUNITY
    // =====================================================

    const openCommunity = (community) => {

        navigation.navigate(
            "CommunityDetails",
            {
                communityId:
                    community._id,

                isMember: true,

                communityName:
                    community.name,
            }
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <View
                style={[
                    styles.loader,
                    {
                        paddingTop:
                            insets.top,
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


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <View
            style={[
                styles.container,
                {
                    paddingTop:
                        insets.top + 15,
                },
            ]}
        >

            <Text style={styles.title}>
                My Communities
            </Text>

            <Text style={styles.subtitle}>
                Communities you have joined
            </Text>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {communities.length === 0 ? (

                <View
                    style={
                        styles.emptyContainer
                    }
                >

                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        No Communities Yet
                    </Text>

                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        You haven't joined any
                        communities yet.
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.discoverButton
                        }
                        onPress={() =>
                            navigation.navigate(
                                "Communities"
                            )
                        }
                    >

                        <Text
                            style={
                                styles.discoverButtonText
                            }
                        >
                            Discover Communities
                        </Text>

                    </TouchableOpacity>

                </View>

            ) : (

                /* =================================================
                   COMMUNITY LIST
                ================================================= */

                <FlatList
                    data={communities}

                    keyExtractor={(item, index) =>
                        item?._id ||
                        index.toString()
                    }

                    renderItem={({ item }) => (

                        <CommunityCard
                            community={item}
                            onPress={() =>
                                openCommunity(
                                    item
                                )
                            }
                        />

                    )}

                    contentContainerStyle={
                        styles.list
                    }

                    showsVerticalScrollIndicator={
                        false
                    }
                />

            )}

        </View>
    );
};


export default MyCommunitiesScreen;


// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 18,
        backgroundColor: "#E6F7F5",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 5,
    },

    subtitle: {
        fontSize: 16,
        color: "#4B5563",
        marginBottom: 20,
    },

    list: {
        paddingBottom: 100,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F7F5",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingBottom: 100,
    },

    emptyTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#155E75",
        marginBottom: 10,
    },

    emptyText: {
        fontSize: 17,
        color: "#4B5563",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 25,
    },

    discoverButton: {
        backgroundColor: "#0F766E",
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: 12,
    },

    discoverButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

});

