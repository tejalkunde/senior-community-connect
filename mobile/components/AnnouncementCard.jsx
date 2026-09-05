import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";

const AnnouncementCard = ({
    announcement,
}) => {

    if (!announcement) {
        return null;
    }

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        try {
            return new Date(
                date
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        } catch (error) {
            return "";
        }
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
        <View style={styles.card}>

            {/* Announcement Title */}

            <Text style={styles.title}>
                {announcement.title}
            </Text>

            {/* Announcement Content */}

            <Text style={styles.content}>
                {announcement.content}
            </Text>

            {/* Date */}

            {announcement.createdAt ? (
                <View style={styles.footer}>

                    <Text style={styles.date}>
                        {formatDate(
                            announcement.createdAt
                        )}
                    </Text>

                    <Text style={styles.time}>
                        {formatTime(
                            announcement.createdAt
                        )}
                    </Text>

                </View>
            ) : null}

        </View>
    );
};

export default AnnouncementCard;

const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,

        borderWidth: 1,
        borderColor: "#E5E7EB",

        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },

    content: {
        fontSize: 15,
        lineHeight: 23,
        color: "#374151",
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        paddingTop: 10,

        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    date: {
        fontSize: 12,
        color: "#6B7280",
    },

    time: {
        fontSize: 12,
        color: "#6B7280",
        marginLeft: 8,
    },

});