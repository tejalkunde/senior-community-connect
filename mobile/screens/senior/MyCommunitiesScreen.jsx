import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import API from "../../services/api";

const MyCommunitiesScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyCommunities();
    }, []);

    const loadMyCommunities = async () => {
        try {
            const response = await API.get("/communities/my");

            setCommunities(
                response.data.communities || response.data
            );

        } catch (error) {
            console.log(
                "My communities error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

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
                    color="#3F7D4A"
                />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 20,
                },
            ]}
        >

            <Text style={styles.title}>
                My Communities
            </Text>

            <Text style={styles.subtitle}>
                Communities you have joined
            </Text>

            {communities.length === 0 ? (

                <View style={styles.emptyContainer}>

                    <Text style={styles.emptyIcon}>
                        👥
                    </Text>

                    <Text style={styles.emptyTitle}>
                        No communities yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Join a community to see it here.
                    </Text>

                </View>

            ) : (

                <FlatList
                    data={communities}

                    keyExtractor={(item) => item._id}

                    renderItem={({ item }) => (

                        <TouchableOpacity
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(
                                    "CommunityDetails",
                                    {
                                        communityId: item._id,
                                    }
                                )
                            }
                        >

                            <Text style={styles.communityName}>
                                {item.name}
                            </Text>

                            <Text style={styles.category}>
                                {item.category}
                            </Text>

                            <Text style={styles.description}>
                                {item.description}
                            </Text>

                            <Text style={styles.members}>
                                {item.memberCount || 0} members
                            </Text>

                        </TouchableOpacity>

                    )}

                    contentContainerStyle={styles.list}

                    showsVerticalScrollIndicator={false}
                />

            )}

        </View>
    );
};

export default MyCommunitiesScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#EDF7ED",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EDF7ED",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 5,
        color: "#245C3A",
    },

    subtitle: {
        fontSize: 16,
        color: "#557A62",
        marginBottom: 20,
    },

    list: {
        paddingBottom: 100,
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        marginBottom: 15,

        borderWidth: 1,
        borderColor: "#CDE8D2",

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
        fontSize: 21,
        fontWeight: "700",
        color: "#245C3A",
    },

    category: {
        fontSize: 16,
        marginTop: 5,
        color: "#557A62",
    },

    description: {
        fontSize: 16,
        marginTop: 10,
        lineHeight: 22,
        color: "#374151",
    },

    members: {
        fontSize: 15,
        marginTop: 10,
        color: "#557A62",
        fontWeight: "600",
    },

    emptyContainer: {
        alignItems: "center",
        marginTop: 70,
        paddingHorizontal: 20,
    },

    emptyIcon: {
        fontSize: 48,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#245C3A",
    },

    emptyText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
        color: "#557A62",
        lineHeight: 23,
    },
});