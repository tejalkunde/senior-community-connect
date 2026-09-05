import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";

import API from "../../services/api";

const EditAnnouncementScreen = ({ route, navigation }) => {
    const {
        announcementId,
        communityId,
        title: initialTitle,
        content: initialContent,
    } = route.params;

    const [title, setTitle] = useState(initialTitle || "");
    const [content, setContent] = useState(initialContent || "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!title.trim()) {
            Alert.alert("Validation", "Please enter announcement title.");
            return;
        }

        if (!content.trim()) {
            Alert.alert("Validation", "Please enter announcement content.");
            return;
        }

        try {
            setLoading(true);

            await API.put(`/announcements/${announcementId}`, {
                title: title.trim(),
                content: content.trim(),
            });

            Alert.alert(
                "Success",
                "Announcement updated successfully.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.log("Update announcement error:", error);

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to update announcement."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Edit Announcement</Text>

            <Text style={styles.label}>Title</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter announcement title"
                value={title}
                onChangeText={setTitle}
                editable={!loading}
            />

            <Text style={styles.label}>Content</Text>

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter announcement content"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                editable={!loading}
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    loading && styles.disabledButton,
                ]}
                onPress={handleUpdate}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Updating..." : "Update Announcement"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
            >
                <Text style={styles.cancelButtonText}>
                    Cancel
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditAnnouncementScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F7F9FC",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 30,
        color: "#1F2937",
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#374151",
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 13,
        fontSize: 16,
        marginBottom: 20,
    },

    textArea: {
        height: 150,
        paddingTop: 15,
    },

    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },

    disabledButton: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    cancelButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 12,
        backgroundColor: "#E5E7EB",
    },

    cancelButtonText: {
        color: "#374151",
        fontSize: 16,
        fontWeight: "600",
    },
});