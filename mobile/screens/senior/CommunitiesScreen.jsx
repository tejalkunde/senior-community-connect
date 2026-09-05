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

import CommunityCard from "../../components/CommunityCard";

import {
    getCommunities,
} from "../../services/communityService";

const CommunitiesScreen = ({ navigation }) => {

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
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.search}
                placeholder="Search communities..."
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
            />

        </View>
    );
};

export default CommunitiesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },

    search: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 15,
        fontSize: 17,
        marginBottom: 15,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 18,
    },
});