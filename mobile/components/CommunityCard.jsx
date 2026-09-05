import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const CommunityCard = ({
    community,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
        >
            <Text style={styles.name}>
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
        </TouchableOpacity>
    );
};

export default CommunityCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
    },

    name: {
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
        marginTop: 10,
        fontSize: 15,
    },
});