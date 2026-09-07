import React, { useCallback, useEffect, useState } from "react";
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
    Alert,
    Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API from "../../services/api";
import {
    connectSocket,
    getSocket,
    disconnectSocket,
} from "../../services/socket";
import { useAuth } from "../../context/authcontext";
import MessageBubble from "../../components/MessageBubble";

const DiscussionScreen = ({ route }) => {
    const { communityId, communityName } = route.params || {};
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    // Measured height of the custom header, used to offset
    // KeyboardAvoidingView correctly on iOS instead of a guessed constant.
    const [headerHeight, setHeaderHeight] = useState(0);

    // On Android with edge-to-edge enabled (default/mandatory from
    // Expo SDK 53+), windowSoftInputMode="resize" no longer reliably
    // resizes the window, so KeyboardAvoidingView's "height" behavior
    // has nothing to react to. We track the keyboard manually instead
    // and apply its height as bottom padding ourselves. This uses only
    // core RN Keyboard events, so it works fine in Expo Go.
    const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

    useEffect(() => {
        if (Platform.OS !== "android") return;

        const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
            setAndroidKeyboardHeight(event.endCoordinates?.height || 0);
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setAndroidKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const loadMessages = useCallback(async () => {
        if (!communityId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await API.get(
                `/communities/${communityId}/messages`
            );

            const data =
                response.data?.data ??
                response.data?.messages ??
                response.data ??
                [];

            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log(
                "Messages error:",
                error.response?.data || error.message
            );

            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [communityId]);

    useEffect(() => {
        let mounted = true;
        let currentSocket = null;

        const handleConnect = () => {
            if (!mounted || !currentSocket) return;

            setSocketConnected(true);

            currentSocket.emit("joinCommunity", communityId);
        };

        const handleDisconnect = (reason) => {
            console.log("Discussion socket disconnected:", reason);

            if (mounted) {
                setSocketConnected(false);
            }
        };

        const handleConnectError = (error) => {
            console.log("SOCKET CONNECTION ERROR:", error?.message);

            if (mounted) {
                setSocketConnected(false);
            }
        };

        const handleNewMessage = (newMessage) => {
            if (!mounted || !newMessage) return;

            setMessages((previousMessages) => {
                if (
                    newMessage?._id &&
                    previousMessages.some(
                        (item) => item?._id === newMessage._id
                    )
                ) {
                    return previousMessages;
                }

                return [...previousMessages, newMessage];
            });
        };

        const handleCommunityJoined = (data) => {
            console.log("Community joined:", data);
        };

        const handleSocketError = (error) => {
            if (mounted && error?.message) {
                Alert.alert("Discussion", error.message);
            }
        };

        const setupSocket = async () => {
            if (!communityId) {
                setLoading(false);
                return;
            }

            try {
                await loadMessages();

                if (!mounted) return;

                currentSocket = await connectSocket();

                if (!currentSocket) {
                    return;
                }

                if (!mounted) return;

                currentSocket.on("connect", handleConnect);
                currentSocket.on("disconnect", handleDisconnect);
                currentSocket.on("connect_error", handleConnectError);
                currentSocket.on("newMessage", handleNewMessage);
                currentSocket.on("communityJoined", handleCommunityJoined);
                currentSocket.on("socketError", handleSocketError);

                if (currentSocket.connected) {
                    handleConnect();
                }
            } catch (error) {
                console.log("Discussion socket setup error:", error);

                if (mounted) {
                    setSocketConnected(false);
                }
            }
        };

        setupSocket();

        return () => {
            mounted = false;

            if (currentSocket) {
                if (currentSocket.connected) {
                    currentSocket.emit("leaveCommunity", communityId);
                }

                currentSocket.off("connect", handleConnect);
                currentSocket.off("disconnect", handleDisconnect);
                currentSocket.off("connect_error", handleConnectError);
                currentSocket.off("newMessage", handleNewMessage);
                currentSocket.off("communityJoined", handleCommunityJoined);
                currentSocket.off("socketError", handleSocketError);
            }

            disconnectSocket();
            currentSocket = null;
        };
    }, [communityId, loadMessages]);

    const sendMessage = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        if (!socketConnected) {
            Alert.alert(
                "Not Connected",
                "Please wait for the discussion to connect."
            );
            return;
        }

        const socket = getSocket();

        if (!socket || !socket.connected) {
            Alert.alert("Disconnected", "Socket is not connected.");

            setSocketConnected(false);
            return;
        }

        try {
            setSending(true);

            socket.emit("sendMessage", {
                communityId,
                content: trimmedMessage,
            });

            setMessage("");

            Keyboard.dismiss();
        } catch (error) {
            console.log("Send message error:", error);

            Alert.alert("Error", "Unable to send message.");
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }) => {
        const senderId =
            item?.sender?._id || item?.sender || item?.senderId;

        const currentUserId = user?._id;

        const isOwnMessage =
            senderId?.toString() === currentUserId?.toString();

        return (
            <MessageBubble message={item} isOwnMessage={isOwnMessage} />
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />

                <Text style={styles.loadingText}>
                    Loading discussion...
                </Text>
            </View>
        );
    }

    // On Android we skip KeyboardAvoidingView's own "height"/"padding"
    // behavior (undefined = no-op) and instead push the input up
    // ourselves via androidKeyboardHeight, since the window itself is
    // no longer resized under edge-to-edge.
    const chatBehavior = Platform.OS === "ios" ? "padding" : undefined;
    const chatOffset =
        Platform.OS === "ios" ? headerHeight + insets.top : 0;

    return (
        <View style={styles.container}>
            {/* HEADER */}

            <View
                style={styles.header}
                onLayout={(event) =>
                    setHeaderHeight(event.nativeEvent.layout.height)
                }
            >
                <Text style={styles.title}>
                    {communityName || "Community Discussion"}
                </Text>

                <View style={styles.connectionRow}>
                    <View
                        style={[
                            styles.statusDot,
                            {
                                backgroundColor: socketConnected
                                    ? "#22C55E"
                                    : "#EF4444",
                            },
                        ]}
                    />

                    <Text
                        style={[
                            styles.statusText,
                            {
                                color: socketConnected
                                    ? "#16A34A"
                                    : "#DC2626",
                            },
                        ]}
                    >
                        {socketConnected ? "Connected" : "Disconnected"}
                    </Text>
                </View>
            </View>

            {/* MESSAGES + INPUT */}

            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={chatBehavior}
                keyboardVerticalOffset={chatOffset}
            >
                <FlatList
                    style={styles.messageListFlex}
                    data={messages}
                    keyExtractor={(item, index) =>
                        item?._id || `message-${index}`
                    }
                    renderItem={renderMessage}
                    contentContainerStyle={[
                        styles.messageList,
                        messages.length === 0 && styles.emptyList,
                    ]}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                    showsVerticalScrollIndicator={false}
                />

                {messages.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>
                            No messages yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Start the discussion with your community.
                        </Text>
                    </View>
                )}

                {/* INPUT */}

                <View
                    style={[
                        styles.inputContainer,
                        {
                            paddingBottom: Math.max(insets.bottom, 8),
                            // Manual Android keyboard offset — see
                            // androidKeyboardHeight effect above.
                            marginBottom:
                                Platform.OS === "android"
                                    ? androidKeyboardHeight
                                    : 0,
                        },
                    ]}
                >
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Write a message..."
                        placeholderTextColor="#888888"
                        style={styles.input}
                        multiline
                        maxLength={1000}
                        textAlignVertical="center"
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!message.trim() ||
                                sending ||
                                !socketConnected) &&
                                styles.sendButtonDisabled,
                        ]}
                        onPress={sendMessage}
                        disabled={
                            !message.trim() || sending || !socketConnected
                        }
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.sendText}>Send</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default DiscussionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },

    loadingContainer: {
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
        marginTop: 6,
    },

    statusDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        marginRight: 6,
    },

    statusText: {
        fontSize: 13,
        fontWeight: "500",
    },

    chatContainer: {
        flex: 1,
    },

    messageListFlex: {
        flex: 1,
    },

    messageList: {
        paddingHorizontal: 10,
        paddingTop: 12,
        paddingBottom: 12,
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
        alignItems: "center",
        paddingHorizontal: 10,
        paddingTop: 8,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#DDDDDD",
    },

    input: {
        flex: 1,
        minHeight: 45,
        maxHeight: 100,
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