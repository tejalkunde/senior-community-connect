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

const CreateCommunityScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateCommunity = async () => {
        if (!name.trim() || !description.trim() || !category.trim()) {
            Alert.alert("Missing Information", "Please fill all fields.");
            return;
        }

        try {
            setLoading(true);

            await API.post("/communities", {
                name: name.trim(),
                description: description.trim(),
                category: category.trim(),
            });

            Alert.alert(
                "Community Created",
                "Your community has been submitted for admin approval.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

            setName("");
            setDescription("");
            setCategory("");
        } catch (error) {
            console.log("Create community error:", error);

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to create community."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Community</Text>

            <Text style={styles.label}>Community Name</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter community name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Description</Text>

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your community"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
            />

            <Text style={styles.label}>Category</Text>

            <TextInput
                style={styles.input}
                placeholder="Example: Health, Yoga, Social"
                value={category}
                onChangeText={setCategory}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateCommunity}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Creating..." : "Create Community"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#F7F9FC",
        flexGrow: 1,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#222",
    },

    label: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },

    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#D0D5DD",
        borderRadius: 10,
        padding: 15,
        fontSize: 17,
        marginBottom: 20,
    },

    textArea: {
        height: 130,
        textAlignVertical: "top",
    },

    button: {
        backgroundColor: "#208AEF",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    cancelButton: {
        padding: 16,
        alignItems: "center",
        marginTop: 10,
    },

    cancelText: {
        fontSize: 17,
        color: "#555",
    },
});

export default CreateCommunityScreen;