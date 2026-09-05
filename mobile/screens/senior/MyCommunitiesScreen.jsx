import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import API from "../../services/api";

const MyCommunitiesScreen = ({ navigation }) => {
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
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                My Communities
            </Text>

            {communities.length === 0 ? (
                <View style={styles.emptyContainer}>
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
                />
            )}
        </View>
    );
};

export default MyCommunitiesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
    },

    communityName: {
        fontSize: 21,
        fontWeight: "700",
    },

    category: {
        fontSize: 16,
        marginTop: 5,
    },

    description: {
        fontSize: 16,
        marginTop: 10,
        lineHeight: 22,
    },

    members: {
        fontSize: 15,
        marginTop: 10,
    },

    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
    },

    emptyTitle: {
        fontSize: 21,
        fontWeight: "700",
    },

    emptyText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    },
});