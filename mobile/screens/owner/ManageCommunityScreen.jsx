import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import API from "../../services/api";

const ManageCommunityScreen = ({
    route,
    navigation,
}) => {

    const {
        communityId,
    } = route.params;

    const insets =
        useSafeAreaInsets();

    const [community, setCommunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [deleting, setDeleting] =
        useState(false);


    // =====================================================
    // LOAD COMMUNITY
    // =====================================================

    const loadCommunity = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    `/communities/${communityId}`
                );

           const data =
            response.data?.data ||
            response.data?.community ||
            response.data;

          setCommunity(data);

        } catch (error) {

            console.log(
                "Load community error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Unable to Load Community",
                error.response?.data?.message ||
                "Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // RELOAD WHEN SCREEN GETS FOCUS
    // =====================================================

    useFocusEffect(
        useCallback(() => {

            loadCommunity();

        }, [communityId])
    );


    // =====================================================
    // DELETE CONFIRMATION
    // =====================================================

    const handleDelete = () => {

        Alert.alert(
            "Delete Community",

            "Are you sure you want to delete this community? This action cannot be undone.",

            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Delete",
                    style: "destructive",
                    onPress:
                        deleteCommunity,
                },
            ]
        );

    };


    // =====================================================
    // DELETE COMMUNITY
    // =====================================================

    const deleteCommunity = async () => {

        try {

            setDeleting(true);

            await API.delete(
                `/communities/${communityId}`
            );

            Alert.alert(
                "Community Deleted",

                "The community has been deleted successfully.",

                [
                    {
                        text: "OK",

                        onPress: () => {

                            navigation.navigate(
                                "OwnerTabs",
                                {
                                    screen:
                                        "OwnerMyCommunities",
                                }
                            );

                        },
                    },
                ]
            );

        } catch (error) {

            console.log(
                "Delete community error:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Unable to Delete Community",
                error.response?.data?.message ||
                "Please try again."
            );

        } finally {

            setDeleting(false);

        }
    };


    // =====================================================
    // STATUS
    // =====================================================

    const status =
        community?.status ||
        "PENDING";


    // =====================================================
    // STATUS STYLES
    // =====================================================

    const getStatusStyle = () => {

        switch (status) {

            case "APPROVED":

                return {
                    container:
                        styles.approvedBadge,

                    text:
                        styles.approvedText,

                    dot:
                        styles.approvedDot,
                };

            case "REJECTED":

                return {
                    container:
                        styles.rejectedBadge,

                    text:
                        styles.rejectedText,

                    dot:
                        styles.rejectedDot,
                };

            case "INACTIVE":

                return {
                    container:
                        styles.inactiveBadge,

                    text:
                        styles.inactiveText,

                    dot:
                        styles.inactiveDot,
                };

            default:

                return {
                    container:
                        styles.pendingBadge,

                    text:
                        styles.pendingText,

                    dot:
                        styles.pendingDot,
                };
        }
    };

    const statusStyle =
        getStatusStyle();


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop:
                            insets.top,

                        paddingBottom:
                            insets.bottom,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color="#2F6FED"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading community...
                </Text>

            </View>
        );
    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!community) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop:
                            insets.top,

                        paddingBottom:
                            insets.bottom,
                    },
                ]}
            >

                <View
                    style={
                        styles.errorIconContainer
                    }
                >

                    <Text
                        style={
                            styles.errorIcon
                        }
                    >
                        !
                    </Text>

                </View>

                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    Community Not Found
                </Text>

                <Text
                    style={
                        styles.errorText
                    }
                >
                    We could not find this community.
                </Text>

                <TouchableOpacity
                    style={
                        styles.retryButton
                    }
                    activeOpacity={0.8}
                    onPress={
                        loadCommunity
                    }
                >

                    <Text
                        style={
                            styles.retryButtonText
                        }
                    >
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>
        );
    }


    // =====================================================
    // MAIN SCREEN
    // =====================================================

    return (
        <View
            style={styles.safeArea}
        >

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={[
                    styles.container,
                    {
                        paddingTop:
                            insets.top + 18,

                        paddingBottom:
                            insets.bottom + 40,
                    },
                ]}
            >

                {/* =========================================
                    HEADER
                ========================================== */}

                <Text
                    style={styles.title}
                >
                    Manage Community
                </Text>

                <Text
                    style={styles.subtitle}
                >
                    View your community details and manage its members and announcements.
                </Text>


                {/* =========================================
                    COMMUNITY DETAILS
                ========================================== */}

                <View
                    style={
                        styles.communityCard
                    }
                >

                    <Text
                        style={
                            styles.communityName
                        }
                    >
                        {community.name}
                    </Text>

                    {community.category ? (

                        <View
                            style={
                                styles.categoryContainer
                            }
                        >

                            <Text
                                style={
                                    styles.categoryLabel
                                }
                            >
                                Category
                            </Text>

                            <Text
                                style={
                                    styles.categoryValue
                                }
                            >
                                {community.category}
                            </Text>

                        </View>

                    ) : null}


                    <View
                        style={
                            styles.statusContainer
                        }
                    >

                        <Text
                            style={
                                styles.statusLabel
                            }
                        >
                            Status
                        </Text>

                        <View
                            style={[
                                styles.statusBadge,
                                statusStyle.container,
                            ]}
                        >

                            <View
                                style={[
                                    styles.statusDot,
                                    statusStyle.dot,
                                ]}
                            />

                            <Text
                                style={[
                                    styles.statusText,
                                    statusStyle.text,
                                ]}
                            >
                                {status}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* =========================================
                    ABOUT COMMUNITY
                ========================================== */}

                <View
                    style={
                        styles.infoCard
                    }
                >

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        About This Community
                    </Text>

                    <Text
                        style={
                            styles.description
                        }
                    >
                        {community.description ||
                            "No description available."}
                    </Text>

                </View>


                {/* =========================================
                    MEMBERS
                ========================================== */}

                <View
                    style={
                        styles.membersCard
                    }
                >

                    <View
                        style={
                            styles.membersNumberContainer
                        }
                    >

                        <Text
                            style={
                                styles.memberCount
                            }
                        >
                            {community.memberCount ||
                                0}
                        </Text>

                    </View>

                    <View
                        style={
                            styles.membersContent
                        }
                    >

                        <Text
                            style={
                                styles.memberTitle
                            }
                        >
                            Community Members
                        </Text>

                        <Text
                            style={
                                styles.memberDescription
                            }
                        >
                            People who have joined this community.
                        </Text>

                    </View>

                </View>


                {/* =========================================
                    STATUS INFORMATION
                ========================================== */}

                {status !== "APPROVED" && (

                    <View
                        style={[
                            styles.infoBox,
                            status === "REJECTED" &&
                                styles.rejectedInfoBox,
                        ]}
                    >

                        <View
                            style={[
                                styles.infoIconContainer,
                                status === "REJECTED" &&
                                    styles.rejectedInfoIconContainer,
                            ]}
                        >

                            <Text
                                style={[
                                    styles.infoIcon,
                                    status === "REJECTED" &&
                                        styles.rejectedInfoIcon,
                                ]}
                            >
                                {status === "PENDING"
                                    ? "..."
                                    : "!"}
                            </Text>

                        </View>

                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoTitle
                                }
                            >
                                {status === "PENDING"
                                    ? "Waiting for Approval"
                                    : "Community Rejected"}
                            </Text>

                            <Text
                                style={
                                    styles.infoText
                                }
                            >
                                {status === "PENDING"
                                    ? "Your community is waiting for admin approval. You can still edit or delete it."
                                    : "This community was rejected by the admin. You can edit the details and try again."}
                            </Text>

                        </View>

                    </View>

                )}


                {/* =========================================
                    COMMUNITY ACTIONS
                ========================================== */}

                <Text
                    style={
                        styles.actionsTitle
                    }
                >
                    Community Actions
                </Text>


                {/* EDIT COMMUNITY */}

                <TouchableOpacity
                    style={
                        styles.actionButton
                    }
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(
                            "EditCommunity",
                            {
                                communityId,
                            }
                        )
                    }
                >

                    <View
                        style={
                            styles.actionNumber
                        }
                    >

                        <Text
                            style={
                                styles.actionNumberText
                            }
                        >
                            1
                        </Text>

                    </View>

                    <View
                        style={
                            styles.actionContent
                        }
                    >

                        <Text
                            style={
                                styles.actionTitle
                            }
                        >
                            Edit Community
                        </Text>

                        <Text
                            style={
                                styles.actionText
                            }
                        >
                            Update the community name, category, or description.
                        </Text>

                    </View>

                    <Text
                        style={
                            styles.arrow
                        }
                    >
                        ›
                    </Text>

                </TouchableOpacity>


                {/* =========================================
                    APPROVED ACTIONS
                ========================================== */}

                {status === "APPROVED" && (

                    <>

                        {/* CREATE ANNOUNCEMENT */}

                        <TouchableOpacity
                            style={
                                styles.actionButton
                            }
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(
                                    "CreateAnnouncement",
                                    {
                                        communityId,
                                    }
                                )
                            }
                        >

                            <View
                                style={
                                    styles.actionNumber
                                }
                            >

                                <Text
                                    style={
                                        styles.actionNumberText
                                    }
                                >
                                    2
                                </Text>

                            </View>

                            <View
                                style={
                                    styles.actionContent
                                }
                            >

                                <Text
                                    style={
                                        styles.actionTitle
                                    }
                                >
                                    Create Announcement
                                </Text>

                                <Text
                                    style={
                                        styles.actionText
                                    }
                                >
                                    Share important updates with community members.
                                </Text>

                            </View>

                            <Text
                                style={
                                    styles.arrow
                                }
                            >
                                ›
                            </Text>

                        </TouchableOpacity>


                        {/* MANAGE MEMBERS */}

                        <TouchableOpacity
                            style={
                                styles.actionButton
                            }
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(
                                    "ManageMembers",
                                    {
                                        communityId,
                                    }
                                )
                            }
                        >

                            <View
                                style={
                                    styles.actionNumber
                                }
                            >

                                <Text
                                    style={
                                        styles.actionNumberText
                                    }
                                >
                                    3
                                </Text>

                            </View>

                            <View
                                style={
                                    styles.actionContent
                                }
                            >

                                <Text
                                    style={
                                        styles.actionTitle
                                    }
                                >
                                    Manage Members
                                </Text>

                                <Text
                                    style={
                                        styles.actionText
                                    }
                                >
                                    View and manage people who joined this community.
                                </Text>

                            </View>

                            <Text
                                style={
                                    styles.arrow
                                }
                            >
                                ›
                            </Text>

                        </TouchableOpacity>

                    </>
                )}


                {/* =========================================
                    DELETE COMMUNITY
                ========================================== */}

                <View
                    style={
                        styles.dangerSection
                    }
                >

                    <Text
                        style={
                            styles.dangerTitle
                        }
                    >
                        Delete Community
                    </Text>

                    <Text
                        style={
                            styles.dangerDescription
                        }
                    >
                        Deleting this community is permanent and cannot be undone.
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.deleteButton
                        }
                        activeOpacity={0.8}
                        onPress={
                            handleDelete
                        }
                        disabled={
                            deleting
                        }
                    >

                        {deleting ? (

                            <ActivityIndicator
                                size="small"
                                color="#B42318"
                            />

                        ) : (

                            <Text
                                style={
                                    styles.deleteButtonText
                                }
                            >
                                Delete Community
                            </Text>

                        )}

                    </TouchableOpacity>

                </View>

            </ScrollView>

        </View>
    );
};

export default ManageCommunityScreen;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    // =================================================
    // CONTAINER
    // =================================================

    safeArea: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },


    // =================================================
    // CENTER
    // =================================================

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        backgroundColor: "#F7F9FC",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 17,
        color: "#667085",
    },


    // =================================================
    // ERROR
    // =================================================

    errorIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#FEECEC",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    errorIcon: {
        fontSize: 32,
        fontWeight: "800",
        color: "#B42318",
    },

    errorTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
        textAlign: "center",
    },

    errorText: {
        fontSize: 17,
        color: "#667085",
        textAlign: "center",
        marginBottom: 22,
    },

    retryButton: {
        minHeight: 52,
        backgroundColor: "#2F6FED",
        paddingHorizontal: 28,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },


    // =================================================
    // HEADER
    // =================================================

    title: {
        fontSize: 29,
        fontWeight: "700",
        color: "#1F2937",
    },

    subtitle: {
        fontSize: 17,
        color: "#667085",
        marginTop: 7,
        marginBottom: 22,
        lineHeight: 24,
    },


    // =================================================
    // COMMUNITY CARD
    // =================================================

    communityCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#E4E7EC",
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },

    communityName: {
        fontSize: 25,
        fontWeight: "700",
        color: "#1F2937",
        lineHeight: 32,
        marginBottom: 18,
    },

    categoryContainer: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EAECF0",
        marginBottom: 15,
    },

    categoryLabel: {
        fontSize: 14,
        color: "#667085",
        marginBottom: 4,
    },

    categoryValue: {
        fontSize: 17,
        fontWeight: "600",
        color: "#344054",
    },

    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    statusLabel: {
        fontSize: 15,
        color: "#667085",
        fontWeight: "600",
    },


    // =================================================
    // STATUS
    // =================================================

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
    },

    pendingBadge: {
        backgroundColor: "#FFF4E5",
    },

    pendingDot: {
        backgroundColor: "#B54708",
    },

    approvedBadge: {
        backgroundColor: "#EAF7EE",
    },

    approvedDot: {
        backgroundColor: "#16803C",
    },

    rejectedBadge: {
        backgroundColor: "#FEECEC",
    },

    rejectedDot: {
        backgroundColor: "#B42318",
    },

    inactiveBadge: {
        backgroundColor: "#F2F4F7",
    },

    inactiveDot: {
        backgroundColor: "#667085",
    },

    statusText: {
        fontSize: 14,
        fontWeight: "700",
    },

    pendingText: {
        color: "#B54708",
    },

    approvedText: {
        color: "#16803C",
    },

    rejectedText: {
        color: "#B42318",
    },

    inactiveText: {
        color: "#475467",
    },


    // =================================================
    // INFORMATION CARD
    // =================================================

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#E4E7EC",
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 10,
    },

    description: {
        fontSize: 17,
        lineHeight: 26,
        color: "#344054",
    },


    // =================================================
    // MEMBERS
    // =================================================

    membersCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E4E7EC",
        marginBottom: 18,
    },

    membersNumberContainer: {
        width: 62,
        height: 62,
        borderRadius: 14,
        backgroundColor: "#E8F1FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    memberCount: {
        fontSize: 25,
        fontWeight: "700",
        color: "#2457B8",
    },

    membersContent: {
        flex: 1,
    },

    memberTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },

    memberDescription: {
        fontSize: 15,
        lineHeight: 21,
        color: "#667085",
        marginTop: 4,
    },


    // =================================================
    // STATUS INFORMATION
    // =================================================

    infoBox: {
        flexDirection: "row",
        backgroundColor: "#FFF8E6",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#F9DFA0",
        marginBottom: 20,
    },

    rejectedInfoBox: {
        backgroundColor: "#FFF5F4",
        borderColor: "#F1B8B3",
    },

    infoIconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#FDE7B2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    rejectedInfoIconContainer: {
        backgroundColor: "#FDDDD9",
    },

    infoIcon: {
        fontSize: 18,
        fontWeight: "800",
        color: "#B54708",
    },

    rejectedInfoIcon: {
        color: "#B42318",
    },

    infoContent: {
        flex: 1,
    },

    infoTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#7A3E00",
    },

    infoText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#8A4B08",
        marginTop: 5,
    },


    // =================================================
    // ACTIONS
    // =================================================

    actionsTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 12,
    },

    actionButton: {
        minHeight: 82,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E4E7EC",
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 13,
        marginBottom: 12,
    },

    actionNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8F1FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 13,
    },

    actionNumberText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#2457B8",
    },

    actionContent: {
        flex: 1,
        paddingRight: 8,
    },

    actionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },

    actionText: {
        fontSize: 15,
        lineHeight: 21,
        color: "#667085",
        marginTop: 4,
    },

    arrow: {
        fontSize: 30,
        color: "#98A2B3",
        marginLeft: 5,
    },


    // =================================================
    // DANGER ZONE
    // =================================================

    dangerSection: {
        marginTop: 15,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#E4E7EC",
    },

    dangerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
    },

    dangerDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: "#667085",
        marginTop: 5,
        marginBottom: 14,
    },

    deleteButton: {
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: "#D92D20",
        backgroundColor: "#FFF5F4",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    deleteButtonText: {
        color: "#B42318",
        fontSize: 17,
        fontWeight: "700",
    },

});