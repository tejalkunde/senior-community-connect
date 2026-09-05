
import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";

import API from "../../services/api";

import {
    connectSocket,
    getSocket,
    disconnectSocket,
} from "../../services/socket";

import { useAuth } from "../../context/authcontext";

import MessageBubble from "../../components/MessageBubble";

const DiscussionScreen = ({ route }) => {
    const {
        communityId,
        communityName,
    } = route.params;

    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!user?._id) {
            return;
        }

        loadMessages();

        const socket = connectSocket(user._id);

        // Join community room
        socket.emit(
            "join_community",
            communityId
        );

        // Receive new messages
        socket.on(
            "receive_message",
            handleReceiveMessage
        );

        return () => {
            socket.off(
                "receive_message",
                handleReceiveMessage
            );

            socket.emit(
                "leave_community",
                communityId
            );

            disconnectSocket();
        };
    }, [communityId, user?._id]);

    const loadMessages = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                `/communities/${communityId}/messages`
            );

            const data =
                response.data.messages ||
                response.data ||
                [];

            setMessages(data);
        } catch (error) {
            console.log(
                "Messages error:",
                error.response?.data ||
                    error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReceiveMessage = (
        newMessage
    ) => {
        setMessages(
            (previousMessages) => {
                // Avoid duplicate messages
                if (
                    newMessage?._id &&
                    previousMessages.some(
                        (item) =>
                            item._id ===
                            newMessage._id
                    )
                ) {
                    return previousMessages;
                }

                return [
                    ...previousMessages,
                    newMessage,
                ];
            }
        );
    };

    const sendMessage = () => {
        const trimmedMessage =
            message.trim();

        if (!trimmedMessage) {
            return;
        }

        const socket = getSocket();

        if (!socket) {
            console.log(
                "Socket is not connected."
            );
            return;
        }

        if (!socket.connected) {
            console.log(
                "Socket is currently disconnected."
            );
            return;
        }

        setSending(true);

        socket.emit("send_message", {
            communityId,
            senderId: user._id,
            content: trimmedMessage,
        });

        setMessage("");

        setSending(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />

                <Text
                    style={styles.loadingText}
                >
                    Loading discussion...
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            {/* HEADER */}

            {communityName ? (
                <View style={styles.header}>
                    <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                    >
                        {communityName}
                    </Text>

                    <Text
                        style={styles.headerSubtitle}
                    >
                        Community Discussion
                    </Text>
                </View>
            ) : null}

            {/* MESSAGES */}

            <FlatList
                data={messages}
                keyExtractor={(
                    item,
                    index
                ) =>
                    item._id ||
                    index.toString()
                }
                renderItem={({ item }) => {
                    const isOwnMessage =
                        item.sender?._id ===
                            user?._id ||
                        item.sender ===
                            user?._id ||
                        item.senderId ===
                            user?._id;

                    return (
                        <MessageBubble
                            message={item}
                            isOwnMessage={
                                isOwnMessage
                            }
                        />
                    );
                }}
                contentContainerStyle={
                    messages.length === 0
                        ? styles.emptyList
                        : styles.messageList
                }
                showsVerticalScrollIndicator={
                    false
                }
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyState
                        }
                    >
                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            💬
                        </Text>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            No Messages Yet
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Start the discussion
                            by sending the
                            first message.
                        </Text>
                    </View>
                }
            />

            {/* MESSAGE INPUT */}

            <View
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Write a message..."
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={1000}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!message.trim() ||
                            sending) &&
                            styles.disabledButton,
                    ]}
                    onPress={sendMessage}
                    disabled={
                        !message.trim() ||
                        sending
                    }
                >
                    {sending ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <Text
                            style={
                                styles.sendText
                            }
                        >
                            Send
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default DiscussionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    /* HEADER */

    header: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    headerSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 3,
    },

    /* LOADING */

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 15,
        color: "#6B7280",
    },

    /* MESSAGES */

    messageList: {
        paddingVertical: 15,
        paddingBottom: 20,
    },

    emptyList: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    /* EMPTY STATE */

    emptyState: {
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 45,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: "#6B7280",
        textAlign: "center",
    },

    /* INPUT */

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    input: {
        flex: 1,
        minHeight: 48,
        maxHeight: 110,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: "#111827",
        backgroundColor: "#F9FAFB",
    },

    /* SEND BUTTON */

    sendButton: {
        minWidth: 70,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2563EB",
        paddingHorizontal: 15,
        borderRadius: 12,
        marginLeft: 8,
    },

    disabledButton: {
        opacity: 0.5,
    },

    sendText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },
});

