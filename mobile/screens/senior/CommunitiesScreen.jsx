import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
    useFocusEffect,
} from "@react-navigation/native";

import CommunityCard from "../../components/CommunityCard";

import {
    getCommunities,
} from "../../services/communityService";


const CommunitiesScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const [communities, setCommunities] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    // =========================
    // LOAD COMMUNITIES
    // =========================

    const loadCommunities = useCallback(
        async ({ isRefresh = false } = {}) => {
            try {

                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const data = await getCommunities();

                console.log("Communities API response:", data);

                /*
                 * Supports different API response formats:
                 *
                 * 1. data = [...]
                 *
                 * 2. data = {
                 *      data: [...]
                 *    }
                 *
                 * 3. data = {
                 *      communities: [...]
                 *    }
                 */

                const communityList =
                    Array.isArray(data)
                        ? data
                        : data?.data ||
                          data?.communities ||
                          [];

                setCommunities(
                    Array.isArray(communityList)
                        ? communityList
                        : []
                );

            } catch (error) {

                console.log(
                    "Community error:",
                    error.response?.data ||
                        error.message
                );

                setCommunities([]);

            } finally {

                setLoading(false);
                setRefreshing(false);

            }
        },
        []
    );


    // Refetch every time this screen comes into focus (e.g. navigating
    // back from CommunityDetails after joining/leaving a community),
    // so member counts and membership status stay current without
    // needing a full app reload.
    useFocusEffect(
        useCallback(() => {
            loadCommunities();
        }, [loadCommunities])
    );


    const onRefresh = useCallback(() => {
        loadCommunities({ isRefresh: true });
    }, [loadCommunities]);


    // =========================
    // SEARCH
    // =========================

    const filteredCommunities =
        communities.filter((community) => {

            const communityName =
                community?.name || "";

            return communityName
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                );

        });


    // =========================
    // LOADING SCREEN
    // =========================

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


    // =========================
    // MAIN SCREEN
    // =========================

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

            {/* PAGE TITLE */}

            <Text style={styles.title}>
                Discover Communities
            </Text>


            {/* SUBTITLE */}

            <Text style={styles.subtitle}>
                Find a community that interests you
            </Text>


            {/* SEARCH */}

            <TextInput
                style={styles.search}
                placeholder="Search communities..."
                placeholderTextColor="#6B7280"
                value={search}
                onChangeText={setSearch}
            />


            {/* COMMUNITY LIST */}

            <FlatList
                data={filteredCommunities}

                keyExtractor={(item, index) =>
                    item?._id ||
                    index.toString()
                }

                renderItem={({ item }) => (

                    <CommunityCard
                        community={item}

                        onPress={() =>
                            navigation.navigate(
                                "CommunityDetails",
                                {
                                    communityId:
                                        item._id,
                                }
                            )
                        }
                    />

                )}

                ListEmptyComponent={

                    <Text style={styles.empty}>
                        No communities found.
                    </Text>

                }

                contentContainerStyle={
                    filteredCommunities.length === 0
                        ? styles.emptyList
                        : styles.list
                }

                showsVerticalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#0F766E"
                        colors={["#0F766E"]}
                    />
                }
            />

        </View>
    );
};


export default CommunitiesScreen;


// =========================
// STYLES
// =========================

const styles = StyleSheet.create({

    // Main screen background
    container: {
        flex: 1,

        paddingHorizontal: 18,

        backgroundColor: "#E6F7F5",
    },


    // Page title
    title: {
        fontSize: 28,

        fontWeight: "700",

        color: "#155E75",

        marginBottom: 5,
    },


    // Subtitle
    subtitle: {
        fontSize: 16,

        color: "#4B5563",

        marginBottom: 15,
    },


    // Search box
    search: {
        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#B7E4DF",

        borderRadius: 14,

        paddingHorizontal: 16,

        paddingVertical: 15,

        fontSize: 17,

        color: "#164E63",

        marginBottom: 15,

        elevation: 2,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 1,
        },

        shadowOpacity: 0.05,

        shadowRadius: 3,
    },


    // Normal list
    list: {
        paddingBottom: 100,
    },


    // Empty list
    emptyList: {
        flexGrow: 1,

        paddingBottom: 100,
    },


    // Loading screen
    loader: {
        flex: 1,

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#E6F7F5",
    },


    // Empty message
    empty: {
        textAlign: "center",

        marginTop: 40,

        fontSize: 18,

        fontWeight: "600",

        color: "#155E75",
    },

});