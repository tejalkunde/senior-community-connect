import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";

import API from "../../services/api";

const EditCommunityScreen = ({ route, navigation }) => {
    const { communityId } = route.params;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadCommunity = async () => {
        try {
            setError("");

            const response = await API.get(
                `/communities/${communityId}`
            );

            const community =
                response.data.community || response.data;

            setName(community.name || "");
            setDescription(community.description || "");
            setCategory(community.category || "");
        } catch (error) {
            console.log("Load community error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load community."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCommunity();
    }, []);

    const handleUpdate = async () => {
        if (!name.trim()) {
            Alert.alert(
                "Validation",
                "Community name is required."
            );
            return;
        }

        if (!description.trim()) {
            Alert.alert(
                "Validation",
                "Community description is required."
            );
            return;
        }

        if (!category.trim()) {
            Alert.alert(
                "Validation",
                "Community category is required."
            );
            return;
        }

        try {
            setSaving(true);

            await API.put(
                `/communities/${communityId}`,
                {
                    name: name.trim(),
                    description: description.trim(),
                    category: category.trim(),
                }
            );

            Alert.alert(
                "Success",
                "Community updated successfully.",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.log("Update community error:", error);

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to update community."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading community...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadCommunity}
                >
                    <Text style={styles.retryText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>
                Edit Community
            </Text>

            <Text style={styles.subtitle}>
                Update your community information
            </Text>

            {/* Community Name */}
            <Text style={styles.label}>
                Community Name
            </Text>

            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter community name"
                placeholderTextColor="#999"
            />

            {/* Description */}
            <Text style={styles.label}>
                Description
            </Text>

            <TextInput
                style={[
                    styles.input,
                    styles.textArea,
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter community description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
            />

            {/* Category */}
            <Text style={styles.label}>
                Category
            </Text>

            <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Example: Health, Yoga, Social"
                placeholderTextColor="#999"
            />

            {/* Update Button */}
            <TouchableOpacity
                style={[
                    styles.updateButton,
                    saving && styles.disabledButton,
                ]}
                onPress={handleUpdate}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.updateText}>
                        Update Community
                    </Text>
                )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={saving}
            >
                <Text style={styles.cancelText}>
                    Cancel
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditCommunityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    content: {
        padding: 24,
        paddingBottom: 40,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222",
        marginTop: 10,
    },

    subtitle: {
        fontSize: 16,
        color: "#666",
        marginTop: 6,
        marginBottom: 30,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
        marginTop: 15,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 16,
        color: "#222",
    },

    textArea: {
        minHeight: 120,
    },

    updateButton: {
        backgroundColor: "#208AEF",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 30,
    },

    disabledButton: {
        opacity: 0.7,
    },

    updateText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    cancelButton: {
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 10,
    },

    cancelText: {
        color: "#D32F2F",
        fontSize: 16,
        fontWeight: "600",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        backgroundColor: "#F7F9FC",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#555",
    },

    errorText: {
        fontSize: 16,
        color: "#D32F2F",
        textAlign: "center",
        marginBottom: 20,
    },

    retryButton: {
        backgroundColor: "#208AEF",
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
    },

    retryText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});