import React from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "../../context/authcontext";

const HomeScreen = () => {

    const { user } = useAuth();

    const insets = useSafeAreaInsets();

    return (
        <View style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    {
                        paddingTop: insets.top + 20,
                        paddingBottom: insets.bottom + 100,
                    },
                ]}
                showsVerticalScrollIndicator={false}
            >

                {/* WELCOME */}

                <Text style={styles.welcome}>
                    Welcome, {user?.name || "Senior"} 👋
                </Text>

                <Text style={styles.subtitle}>
                    We're happy to have you with us.
                </Text>


                {/* HERO CARD */}

                <View style={styles.heroCard}>

                    <Text style={styles.heroIcons}>
                        👥 🤝 💬
                    </Text>

                    <Text style={styles.heroTitle}>
                        Stay Connected.
                    </Text>

                    <Text style={styles.heroTitle}>
                        Stay Active.
                    </Text>

                    <Text style={styles.heroTitle}>
                        Stay Together.
                    </Text>

                    <Text style={styles.heroText}>
                        Connect with people, discover
                        communities and enjoy meaningful
                        conversations.
                    </Text>

                </View>


                {/* ABOUT CARD */}

                <View style={styles.aboutCard}>

                    <Text style={styles.sectionTitle}>
                        About Our Community
                    </Text>

                    <Text style={styles.sectionText}>
                        Senior Community Connect is a
                        platform designed to help senior
                        citizens connect with people,
                        discover communities, take part in
                        activities and stay socially
                        connected.
                    </Text>

                </View>


                {/* WHAT YOU CAN DO */}

                <Text style={styles.mainSectionTitle}>
                    What You Can Do
                </Text>


                {/* DISCOVER COMMUNITIES */}

                <View style={styles.discoverCard}>

                    <View style={styles.discoverIcon}>

                        <Text style={styles.icon}>
                            👥
                        </Text>

                    </View>

                    <View style={styles.featureContent}>

                        <Text style={styles.featureTitle}>
                            Discover Communities
                        </Text>

                        <Text style={styles.featureText}>
                            Find communities based on
                            your interests and activities.
                        </Text>

                    </View>

                </View>


                {/* JOIN COMMUNITIES */}

                <View style={styles.joinCard}>

                    <View style={styles.joinIcon}>

                        <Text style={styles.icon}>
                            ❤️
                        </Text>

                    </View>

                    <View style={styles.featureContent}>

                        <Text style={styles.featureTitle}>
                            Join Communities
                        </Text>

                        <Text style={styles.featureText}>
                            Join communities and connect
                            with other members.
                        </Text>

                    </View>

                </View>


                {/* DISCUSSIONS */}

                <View style={styles.discussionCard}>

                    <View style={styles.discussionIcon}>

                        <Text style={styles.icon}>
                            💬
                        </Text>

                    </View>

                    <View style={styles.featureContent}>

                        <Text style={styles.featureTitle}>
                            Start Discussions
                        </Text>

                        <Text style={styles.featureText}>
                            Share your thoughts and
                            communicate with your community.
                        </Text>

                    </View>

                </View>


                {/* UPDATES */}

                <View style={styles.updateCard}>

                    <View style={styles.updateIcon}>

                        <Text style={styles.icon}>
                            📢
                        </Text>

                    </View>

                    <View style={styles.featureContent}>

                        <Text style={styles.featureTitle}>
                            Stay Updated
                        </Text>

                        <Text style={styles.featureText}>
                            Stay informed about community
                            announcements and activities.
                        </Text>

                    </View>

                </View>


                {/* FOOTER CARD */}

                <View style={styles.footerCard}>

                    <Text style={styles.footerIcon}>
                        🌟
                    </Text>

                    <Text style={styles.footerTitle}>
                        You are not alone.
                    </Text>

                    <Text style={styles.footerText}>
                        Connect, participate and build
                        meaningful relationships with
                        your community.
                    </Text>

                </View>

            </ScrollView>

        </View>
    );
};

export default HomeScreen;


const styles = StyleSheet.create({

    /* MAIN SCREEN */

    safeArea: {
        flex: 1,
        backgroundColor: "#E8F1FF",
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },


    /* WELCOME */

    welcome: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    subtitle: {
        fontSize: 17,
        color: "#4B5563",
        marginTop: 6,
        marginBottom: 22,
        lineHeight: 24,
    },


    /* HERO - SOFT BLUE */

    heroCard: {
        backgroundColor: "#DBEAFE",

        borderRadius: 20,

        padding: 25,

        marginBottom: 20,

        borderWidth: 1,
        borderColor: "#BFDBFE",

        elevation: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },

    heroIcons: {
        fontSize: 34,
        marginBottom: 18,
    },

    heroTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#1E3A8A",
        marginBottom: 2,
    },

    heroText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#1E40AF",
        marginTop: 15,
    },


    /* ABOUT - SOFT PURPLE */

    aboutCard: {
        backgroundColor: "#F3E8FF",

        borderRadius: 18,

        padding: 20,

        marginBottom: 25,

        borderWidth: 1,
        borderColor: "#E9D5FF",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#581C87",
        marginBottom: 10,
    },

    sectionText: {
        fontSize: 16,
        lineHeight: 25,
        color: "#6B21A8",
    },


    /* SECTION TITLE */

    mainSectionTitle: {
        fontSize: 23,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 15,
    },


    /* DISCOVER - SOFT GREEN */

    discoverCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#DCFCE7",

        borderRadius: 16,

        padding: 17,

        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#BBF7D0",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    discoverIcon: {
        width: 55,
        height: 55,

        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#BBF7D0",

        marginRight: 15,
    },


    /* JOIN - SOFT PINK */

    joinCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FCE7F3",

        borderRadius: 16,

        padding: 17,

        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#FBCFE8",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    joinIcon: {
        width: 55,
        height: 55,

        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FBCFE8",

        marginRight: 15,
    },


    /* DISCUSSION - SOFT ORANGE */

    discussionCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFEDD5",

        borderRadius: 16,

        padding: 17,

        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#FED7AA",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    discussionIcon: {
        width: 55,
        height: 55,

        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FED7AA",

        marginRight: 15,
    },


    /* UPDATES - SOFT YELLOW */

    updateCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FEF3C7",

        borderRadius: 16,

        padding: 17,

        marginBottom: 25,

        borderWidth: 1,
        borderColor: "#FDE68A",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    updateIcon: {
        width: 55,
        height: 55,

        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FDE68A",

        marginRight: 15,
    },


    /* FEATURE CONTENT */

    featureContent: {
        flex: 1,
    },

    icon: {
        fontSize: 27,
    },

    featureTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },

    featureText: {
        fontSize: 15,
        lineHeight: 21,
        color: "#4B5563",
        marginTop: 4,
    },


    /* FOOTER - SOFT SKY BLUE */

    footerCard: {
        alignItems: "center",

        backgroundColor: "#E0F2FE",

        borderRadius: 18,

        padding: 25,

        marginBottom: 20,

        borderWidth: 1,
        borderColor: "#BAE6FD",

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    footerIcon: {
        fontSize: 35,
        marginBottom: 8,
    },

    footerTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#0C4A6E",
    },

    footerText: {
        fontSize: 16,
        lineHeight: 23,
        color: "#075985",
        textAlign: "center",
        marginTop: 8,
    },

});