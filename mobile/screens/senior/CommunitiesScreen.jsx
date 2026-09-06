import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import CommunityCard from "../../components/CommunityCard";

import {
    getCommunities,
} from "../../services/communityService";

const CommunitiesScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const [communities, setCommunities] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCommunities();
    }, []);

    const loadCommunities = async () => {
        try {
            const data = await getCommunities();

            setCommunities(data.communities || data);

        } catch (error) {
            console.log(
                "Community error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredCommunities =
        communities.filter((community) =>
            community.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

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

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 15,
                },
            ]}
        >

            <Text style={styles.title}>
                Discover Communities
            </Text>

            <Text style={styles.subtitle}>
                Find a community that interests you
            </Text>

            <TextInput
                style={styles.search}
                placeholder="Search communities..."
                placeholderTextColor="#6B7280"
                value={search}
                onChangeText={setSearch}
            />

            <FlatList
                data={filteredCommunities}

                keyExtractor={(item) => item._id}

                renderItem={({ item }) => (
                    <CommunityCard
                        community={item}
                        onPress={() =>
                            navigation.navigate(
                                "CommunityDetails",
                                {
                                    communityId: item._id,
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
            />

        </View>
    );
};

export default CommunitiesScreen;

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
        marginBottom: 15,
    },

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

    list: {
        paddingBottom: 100,
    },

    emptyList: {
        flexGrow: 1,
        paddingBottom: 100,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F7F5",
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 18,
        fontWeight: "600",
        color: "#155E75",
    },
});