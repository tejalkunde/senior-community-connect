import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

import API from "../../services/api";

const CreateAnnouncementScreen = ({
    route,
    navigation,
}) => {

    const { communityId } = route.params;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {

        if (!title || !content) {
            Alert.alert(
                "Error",
                "Please enter title and content"
            );
            return;
        }

        try {

            setLoading(true);

            await API.post(
                `/communities/${communityId}/announcements`,
                {
                    title,
                    content,
                }
            );

            Alert.alert(
                "Success",
                "Announcement created."
            );

            navigation.goBack();

        } catch (error) {

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Failed to create announcement"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                New Announcement
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Announcement title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={[
                    styles.input,
                    styles.content,
                ]}
                placeholder="Announcement content"
                multiline
                value={content}
                onChangeText={setContent}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreate}
            >
                <Text style={styles.buttonText}>
                    {loading
                        ? "Publishing..."
                        : "Publish Announcement"}
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default CreateAnnouncementScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 27,
        fontWeight: "700",
        marginBottom: 25,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 16,
        fontSize: 17,
        marginBottom: 15,
    },

    content: {
        height: 150,
        textAlignVertical: "top",
    },

    button: {
        backgroundColor: "#2563EB",
        padding: 17,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
});