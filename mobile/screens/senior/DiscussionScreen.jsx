
import React, { useEffect, useState } from "react";

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

import { useSafeAreaInsets } from "react-native-safe-area-context";

import API from "../../services/api";

import {
    connectSocket,
    disconnectSocket,
} from "../../services/socket";

import { useAuth } from "../../context/authcontext";

import MessageBubble from "../../components/MessageBubble";

const DiscussionScreen = ({ route }) => {
    const {
        communityId,
        communityName,
    } = route.params || {};

    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    // =====================================================
    // LOAD MESSAGES + CONNECT SOCKET
    // =====================================================

    useEffect(() => {
        let mounted = true;
        let socket = null;

        const setupDiscussion = async () => {
            if (!user?._id || !communityId) {
                setLoading(false);
                return;
            }

            try {
                await loadMessages();

                socket = await connectSocket();

                if (!socket || !mounted) {
                    return;
                }

                const handleConnect = () => {
                    console.log(
                        "Discussion socket connected:",
                        socket.id
                    );

                    if (!mounted) return;

                    setSocketConnected(true);

                    socket.emit(
                        "joinCommunity",
                        communityId
                    );

                    console.log(
                        "Joined community:",
                        communityId
                    );
                };

                const handleDisconnect = () => {
                    console.log(
                        "Discussion socket disconnected"
                    );

                    if (!mounted) return;

                    setSocketConnected(false);
                };

                const handleReceiveMessage = (newMessage) => {
                    console.log(
                        "New message received:",
                        newMessage
                    );

                    if (!mounted) return;

                    setMessages((previousMessages) => {
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
                    });
                };

                const handleSocketError = (error) => {
                    console.log(
                        "Socket error:",
                        error
                    );
                };

                socket.on(
                    "connect",
                    handleConnect
                );

                socket.on(
                    "disconnect",
                    handleDisconnect
                );

                socket.on(
                    "newMessage",
                    handleReceiveMessage
                );

                socket.on(
                    "socketError",
                    handleSocketError
                );

                if (socket.connected) {
                    handleConnect();
                }

            } catch (error) {
                console.log(
                    "Discussion setup error:",
                    error
                );
            }
        };

        setupDiscussion();

        return () => {
            mounted = false;

            if (socket) {
                socket.emit(
                    "leaveCommunity",
                    communityId
                );

                socket.off("connect");
                socket.off("disconnect");
                socket.off("newMessage");
                socket.off("socketError");
            }

            setSocketConnected(false);

            disconnectSocket();
        };

    }, [communityId, user?._id]);

    // =====================================================
    // LOAD OLD MESSAGES
    // =====================================================

    const loadMessages = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                `/communities/${communityId}/messages`
            );

            console.log(
                "Messages API response:",
                response.data
            );

            const data =
                response.data?.data ||
                response.data?.messages ||
                [];

            const messagesArray =
                Array.isArray(data)
                    ? data
                    : [];

            setMessages(messagesArray);

        } catch (error) {
            console.log(
                "Messages error:",
                error.response?.data ||
                error.message
            );

            setMessages([]);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {
        const trimmedMessage =
            message.trim();

        if (!trimmedMessage) {
            return;
        }

        try {
            const socket =
                await connectSocket();

            if (!socket) {
                console.log(
                    "Socket is not available."
                );
                return;
            }

            if (!socket.connected) {
                console.log(
                    "Socket is not connected."
                );
                return;
            }

            setSending(true);

            socket.emit(
                "sendMessage",
                {
                    communityId,
                    content: trimmedMessage,
                }
            );

            setMessage("");

        } catch (error) {
            console.log(
                "Send message error:",
                error
            );
        } finally {
            setSending(false);
        }
    };

    // =====================================================
    // RENDER MESSAGE
    // =====================================================

    const renderMessage = ({ item }) => {
        const senderId =
            item?.sender?._id ||
            item?.sender;

        const currentUserId =
            user?._id;

        const isOwnMessage =
            senderId?.toString() ===
            currentUserId?.toString();

        return (
            <MessageBubble
                message={item}
                isOwnMessage={isOwnMessage}
            />
        );
    };

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <View
                style={[
                    styles.centerContainer,
                    {
                        paddingTop:
                            insets.top,
                    },
                ]}
            >
                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />

                <Text style={styles.loadingText}>
                    Loading discussion...
                </Text>
            </View>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : "height"
            }
            keyboardVerticalOffset={
                Platform.OS === "ios"
                    ? 90
                    : 0
            }
        >

            {/* HEADER */}

            <View style={styles.header}>
                <Text style={styles.title}>
                    {communityName ||
                        "Community Discussion"}
                </Text>

                <View
                    style={
                        styles.connectionRow
                    }
                >
                    <View
                        style={[
                            styles.statusDot,
                            {
                                backgroundColor:
                                    socketConnected
                                        ? "#22C55E"
                                        : "#EF4444",
                            },
                        ]}
                    />

                    <Text style={styles.statusText}>
                        {socketConnected
                            ? "Connected"
                            : "Disconnected"}
                    </Text>
                </View>
            </View>

            {/* MESSAGES */}

            <FlatList
                data={messages}
                keyExtractor={(item, index) =>
                    item?._id ||
                    index.toString()
                }
                renderItem={renderMessage}
                contentContainerStyle={[
                    styles.messageList,
                    messages.length === 0 &&
                        styles.emptyList,
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            />

            {/* EMPTY STATE */}

            {messages.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>
                        No messages yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Start the discussion with
                        your community.
                    </Text>
                </View>
            )}

            {/* MESSAGE INPUT */}

            <View
                style={[
                    styles.inputContainer,
                    {
                        paddingBottom:
                            Math.max(
                                insets.bottom,
                                10
                            ),
                    },
                ]}
            >
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Write a message..."
                    placeholderTextColor="#888"
                    style={styles.input}
                    multiline
                    maxLength={1000}
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (
                            !message.trim() ||
                            sending ||
                            !socketConnected
                        ) &&
                            styles.sendButtonDisabled,
                    ]}
                    onPress={sendMessage}
                    disabled={
                        !message.trim() ||
                        sending ||
                        !socketConnected
                    }
                >
                    {sending ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <Text style={styles.sendText}>
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
        backgroundColor: "#F5F5F5",
    },

    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666666",
    },

    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222222",
    },

    connectionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    statusText: {
        fontSize: 12,
        color: "#666666",
    },

    messageList: {
        paddingTop: 12,
        paddingBottom: 20,
    },

    emptyList: {
        flexGrow: 1,
    },

    emptyContainer: {
        position: "absolute",
        top: "45%",
        left: 0,
        right: 0,
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#444444",
    },

    emptyText: {
        marginTop: 6,
        fontSize: 14,
        color: "#777777",
        textAlign: "center",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        paddingTop: 8,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#DDDDDD",
    },

    input: {
        flex: 1,
        minHeight: 45,
        maxHeight: 110,
        backgroundColor: "#F1F1F1",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: "#222222",
        marginRight: 8,
    },

    sendButton: {
        minWidth: 65,
        height: 45,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2563EB",
    },

    sendButtonDisabled: {
        opacity: 0.5,
    },

    sendText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 14,
    },
});

