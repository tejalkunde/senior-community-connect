import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";

const MessageBubble = ({
    message,
    isOwnMessage,
}) => {

    if (!message) {
        return null;
    }

    const getMessageContent = () => {
        return (
            message.content ||
            message.message ||
            ""
        );
    };

    const getSenderName = () => {

        if (message.sender?.name) {
            return message.sender.name;
        }

        if (message.senderName) {
            return message.senderName;
        }

        return "User";
    };

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        try {
            return new Date(
                date
            ).toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch (error) {
            return "";
        }
    };

    return (
        <View
            style={[
                styles.container,
                isOwnMessage
                    ? styles.ownContainer
                    : styles.otherContainer,
            ]}
        >

            {/* Sender Name */}

            {!isOwnMessage && (
                <Text style={styles.senderName}>
                    {getSenderName()}
                </Text>
            )}

            {/* Message Bubble */}

            <View
                style={[
                    styles.bubble,

                    isOwnMessage
                        ? styles.ownBubble
                        : styles.otherBubble,
                ]}
            >

                <Text
                    style={[
                        styles.messageText,

                        isOwnMessage
                            ? styles.ownMessageText
                            : styles.otherMessageText,
                    ]}
                >
                    {getMessageContent()}
                </Text>

                {/* Time */}

                {message.createdAt ? (
                    <Text
                        style={[
                            styles.time,

                            isOwnMessage
                                ? styles.ownTime
                                : styles.otherTime,
                        ]}
                    >
                        {formatTime(
                            message.createdAt
                        )}
                    </Text>
                ) : null}

            </View>

        </View>
    );
};

export default MessageBubble;

const styles = StyleSheet.create({

    container: {
        width: "100%",
        marginVertical: 5,
        paddingHorizontal: 12,
    },

    ownContainer: {
        alignItems: "flex-end",
    },

    otherContainer: {
        alignItems: "flex-start",
    },

    senderName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 3,
        marginLeft: 8,
    },

    bubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },

    ownBubble: {
        backgroundColor: "#2563EB",
        borderBottomRightRadius: 4,
    },

    otherBubble: {
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 4,

        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },

    ownMessageText: {
        color: "#FFFFFF",
    },

    otherMessageText: {
        color: "#111827",
    },

    time: {
        fontSize: 10,
        marginTop: 5,
    },

    ownTime: {
        color: "#DBEAFE",
        textAlign: "right",
    },

    otherTime: {
        color: "#9CA3AF",
        textAlign: "right",
    },

});