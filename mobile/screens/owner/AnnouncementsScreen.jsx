import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";

import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import API from "../../services/api";

const AnnouncementsScreen = () => {

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    const [announcements, setAnnouncements] = useState([]);

    const [loadingCommunities, setLoadingCommunities] =
        useState(true);

    const [loadingAnnouncements, setLoadingAnnouncements] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);


    // -----------------------------------------
    // LOAD OWNER COMMUNITIES
    // -----------------------------------------

    const loadCommunities = useCallback(async () => {

        try {

            const response = await API.get(
                "/communities/my"
            );

            const data =
                response.data.communities ||
                response.data;

            const communityList =
                Array.isArray(data)
                    ? data
                    : [];

            setCommunities(communityList);

            // Keep selected community if it still exists
            if (selectedCommunity) {

                const updatedCommunity =
                    communityList.find(
                        (community) =>
                            community._id ===
                            selectedCommunity._id
                    );

                if (updatedCommunity) {
                    setSelectedCommunity(
                        updatedCommunity
                    );
                } else {
                    setSelectedCommunity(null);
                    setAnnouncements([]);
                }

            }

        } catch (error) {

            console.log(
                "Load communities error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to load your communities."
            );

        } finally {

            setLoadingCommunities(false);
            setRefreshing(false);

        }

    }, [selectedCommunity]);


    // -----------------------------------------
    // LOAD ANNOUNCEMENTS
    // -----------------------------------------

    const loadAnnouncements = useCallback(
        async (communityId) => {

            if (!communityId) {
                setAnnouncements([]);
                return;
            }

            try {

                setLoadingAnnouncements(true);

                const response = await API.get(
                    `/communities/${communityId}/announcements`
                );

                const data =
                    response.data.announcements ||
                    response.data;

                const announcementList =
                    Array.isArray(data)
                        ? data
                        : [];

                // Newest first
                announcementList.sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );

                setAnnouncements(
                    announcementList
                );

            } catch (error) {

                console.log(
                    "Load announcements error:",
                    error
                );

                Alert.alert(
                    "Error",
                    error.response?.data?.message ||
                        "Unable to load announcements."
                );

            } finally {

                setLoadingAnnouncements(false);

            }

        },
        []
    );


    // -----------------------------------------
    // REFRESH WHEN TAB OPENS
    // -----------------------------------------

    useFocusEffect(
        useCallback(() => {

            loadCommunities();

        }, [loadCommunities])
    );


    // -----------------------------------------
    // SELECT COMMUNITY
    // -----------------------------------------

    const handleSelectCommunity = (
        community
    ) => {

        setSelectedCommunity(community);

        loadAnnouncements(
            community._id
        );
    };


    // -----------------------------------------
    // REFRESH
    // -----------------------------------------

    const handleRefresh = async () => {

        setRefreshing(true);

        try {

            const response = await API.get(
                "/communities/my"
            );

            const data =
                response.data.communities ||
                response.data;

            const communityList =
                Array.isArray(data)
                    ? data
                    : [];

            setCommunities(
                communityList
            );

            if (selectedCommunity) {

                const updatedCommunity =
                    communityList.find(
                        (community) =>
                            community._id ===
                            selectedCommunity._id
                    );

                if (updatedCommunity) {

                    setSelectedCommunity(
                        updatedCommunity
                    );

                    await loadAnnouncements(
                        updatedCommunity._id
                    );

                } else {

                    setSelectedCommunity(null);
                    setAnnouncements([]);

                }

            }

        } catch (error) {

            console.log(
                "Refresh error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to refresh."
            );

        } finally {

            setRefreshing(false);

        }

    };


    // -----------------------------------------
    // DELETE ANNOUNCEMENT
    // -----------------------------------------

    const handleDelete = (
        announcementId
    ) => {

        Alert.alert(
            "Delete Announcement",
            "Are you sure you want to delete this announcement?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                        deleteAnnouncement(
                            announcementId
                        ),
                },
            ]
        );

    };


    const deleteAnnouncement = async (
        announcementId
    ) => {

        try {

            setDeletingId(
                announcementId
            );

            await API.delete(
                `/announcements/${announcementId}`
            );

            setAnnouncements(
                (current) =>
                    current.filter(
                        (item) =>
                            item._id !==
                            announcementId
                    )
            );

            Alert.alert(
                "Success",
                "Announcement deleted successfully."
            );

        } catch (error) {

            console.log(
                "Delete announcement error:",
                error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                    "Unable to delete announcement."
            );

        } finally {

            setDeletingId(null);

        }

    };


    // -----------------------------------------
    // CREATE ANNOUNCEMENT
    // -----------------------------------------

    const handleCreateAnnouncement = () => {

        if (!selectedCommunity) {

            Alert.alert(
                "Select Community",
                "Please select a community first."
            );

            return;
        }

        navigation.navigate(
            "CreateAnnouncement",
            {
                communityId:
                    selectedCommunity._id,
            }
        );

    };


    // -----------------------------------------
    // EDIT ANNOUNCEMENT
    // -----------------------------------------

    const handleEditAnnouncement = (
        item
    ) => {

        navigation.navigate(
            "EditAnnouncement",
            {
                announcementId:
                    item._id,

                communityId:
                    selectedCommunity._id,

                title:
                    item.title,

                content:
                    item.content,
            }
        );

    };


    // -----------------------------------------
    // LOADING COMMUNITIES
    // -----------------------------------------

    if (loadingCommunities) {

        return (
            <View
                style={[
                    styles.center,
                    {
                        paddingTop:
                            insets.top,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color="#7C3AED"
                />

                <Text
                    style={styles.loadingText}
                >
                    Loading your communities...
                </Text>

            </View>
        );

    }


    // -----------------------------------------
    // RENDER COMMUNITY
    // -----------------------------------------

    const renderCommunity = ({
        item,
    }) => {

        const isSelected =
            selectedCommunity?._id ===
            item._id;

        return (
            <TouchableOpacity
                style={[
                    styles.communityCard,
                    isSelected &&
                        styles.selectedCommunityCard,
                ]}
                onPress={() =>
                    handleSelectCommunity(
                        item
                    )
                }
                activeOpacity={0.8}
            >

                <View
                    style={styles.communityIcon}
                >
                    <Text
                        style={
                            styles.communityIconText
                        }
                    >
                        👥
                    </Text>
                </View>

                <View
                    style={
                        styles.communityInfo
                    }
                >

                    <Text
                        style={
                            styles.communityName
                        }
                        numberOfLines={1}
                    >
                        {item.name}
                    </Text>

                    {item.category && (
                        <Text
                            style={
                                styles.communityCategory
                            }
                        >
                            {item.category}
                        </Text>
                    )}

                    <Text
                        style={
                            styles.memberText
                        }
                    >
                        {item.memberCount || 0} members
                    </Text>

                </View>

                {isSelected && (
                    <View
                        style={
                            styles.selectedBadge
                        }
                    >
                        <Text
                            style={
                                styles.selectedBadgeText
                            }
                        >
                            ✓
                        </Text>
                    </View>
                )}

            </TouchableOpacity>
        );
    };


    // -----------------------------------------
    // RENDER ANNOUNCEMENT
    // -----------------------------------------

    const renderAnnouncement = ({
        item,
    }) => {

        const announcementId =
            item._id;

        return (
            <View
                style={styles.announcementCard}
            >

                <View
                    style={
                        styles.cardHeader
                    }
                >

                    <View
                        style={
                            styles.titleContainer
                        }
                    >

                        <Text
                            style={
                                styles.announcementTitle
                            }
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>

                        {item.isPinned && (
                            <Text
                                style={
                                    styles.pinned
                                }
                            >
                                📌 Pinned
                            </Text>
                        )}

                    </View>

                </View>

                <Text
                    style={styles.content}
                >
                    {item.content}
                </Text>

                {item.createdAt && (
                    <Text
                        style={styles.date}
                    >
                        {new Date(
                            item.createdAt
                        ).toLocaleDateString()}
                    </Text>
                )}

                <View
                    style={styles.actions}
                >

                    <TouchableOpacity
                        style={
                            styles.editButton
                        }
                        onPress={() =>
                            handleEditAnnouncement(
                                item
                            )
                        }
                        activeOpacity={0.8}
                    >
                        <Text
                            style={
                                styles.editText
                            }
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.deleteButton
                        }
                        onPress={() =>
                            handleDelete(
                                announcementId
                            )
                        }
                        disabled={
                            deletingId ===
                            announcementId
                        }
                        activeOpacity={0.8}
                    >

                        {deletingId ===
                        announcementId ? (

                            <ActivityIndicator
                                size="small"
                                color="#B42318"
                            />

                        ) : (

                            <Text
                                style={
                                    styles.deleteText
                                }
                            >
                                Delete
                            </Text>

                        )}

                    </TouchableOpacity>

                </View>

            </View>
        );
    };


    // -----------------------------------------
    // MAIN UI
    // -----------------------------------------

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop:
                        insets.top,
                },
            ]}
        >

            {/* HEADER */}

            <View
                style={styles.header}
            >

                <Text
                    style={styles.title}
                >
                    Announcements
                </Text>

                <Text
                    style={styles.subtitle}
                >
                    Select a community to manage its announcements
                </Text>

            </View>


            {/* NO COMMUNITIES */}

            {communities.length === 0 ? (

                <View
                    style={styles.emptyContainer}
                >

                    <Text
                        style={styles.emptyIcon}
                    >
                        👥
                    </Text>

                    <Text
                        style={styles.emptyTitle}
                    >
                        No Communities
                    </Text>

                    <Text
                        style={styles.emptyText}
                    >
                        You need to create a community
                        before you can manage announcements.
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.createCommunityButton
                        }
                        onPress={() =>
                            navigation.navigate(
                                "CreateCommunity"
                            )
                        }
                        activeOpacity={0.8}
                    >

                        <Text
                            style={
                                styles.createCommunityButtonText
                            }
                        >
                            Create Community
                        </Text>

                    </TouchableOpacity>

                </View>

            ) : (

                <FlatList
                    data={
                        selectedCommunity
                            ? announcements
                            : []
                    }
                    keyExtractor={(item) =>
                        item._id
                    }
                    renderItem={
                        renderAnnouncement
                    }

                    refreshControl={
                        <RefreshControl
                            refreshing={
                                refreshing
                            }
                            onRefresh={
                                handleRefresh
                            }
                            colors={[
                                "#7C3AED",
                            ]}
                        />
                    }

                    showsVerticalScrollIndicator={
                        false
                    }

                    contentContainerStyle={[
                        styles.list,
                        {
                            paddingBottom:
                                insets.bottom +
                                110,
                        },
                    ]}

                    ListHeaderComponent={

                        <View>

                            {/* COMMUNITY SELECTOR */}

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Your Communities
                            </Text>

                            <FlatList
                                data={
                                    communities
                                }
                                keyExtractor={(
                                    item
                                ) =>
                                    item._id
                                }
                                renderItem={
                                    renderCommunity
                                }
                                horizontal
                                showsHorizontalScrollIndicator={
                                    false
                                }
                                contentContainerStyle={
                                    styles.communityList
                                }
                            />


                            {/* SELECTED COMMUNITY */}

                            {selectedCommunity && (
                                <View
                                    style={
                                        styles.selectedHeader
                                    }
                                >

                                    <View>

                                        <Text
                                            style={
                                                styles.selectedLabel
                                            }
                                        >
                                            Managing announcements for
                                        </Text>

                                        <Text
                                            style={
                                                styles.selectedName
                                            }
                                        >
                                            {
                                                selectedCommunity.name
                                            }
                                        </Text>

                                    </View>

                                    <TouchableOpacity
                                        style={
                                            styles.createSmallButton
                                        }
                                        onPress={
                                            handleCreateAnnouncement
                                        }
                                        activeOpacity={
                                            0.8
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.createSmallButtonText
                                            }
                                        >
                                            + Add
                                        </Text>

                                    </TouchableOpacity>

                                </View>
                            )}


                            {/* LOADING ANNOUNCEMENTS */}

                            {selectedCommunity &&
                                loadingAnnouncements && (
                                    <View
                                        style={
                                            styles.announcementLoading
                                        }
                                    >

                                        <ActivityIndicator
                                            size="large"
                                            color="#7C3AED"
                                        />

                                        <Text
                                            style={
                                                styles.loadingText
                                            }
                                        >
                                            Loading announcements...
                                        </Text>

                                    </View>
                                )}


                            {/* EMPTY ANNOUNCEMENTS */}

                            {selectedCommunity &&
                                !loadingAnnouncements &&
                                announcements.length ===
                                    0 && (

                                    <View
                                        style={
                                            styles.emptyAnnouncement
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.emptyAnnouncementIcon
                                            }
                                        >
                                            📢
                                        </Text>

                                        <Text
                                            style={
                                                styles.emptyAnnouncementTitle
                                            }
                                        >
                                            No Announcements
                                        </Text>

                                        <Text
                                            style={
                                                styles.emptyAnnouncementText
                                            }
                                        >
                                            You haven't created
                                            any announcements
                                            for this community yet.
                                        </Text>

                                        <TouchableOpacity
                                            style={
                                                styles.createButton
                                            }
                                            onPress={
                                                handleCreateAnnouncement
                                            }
                                            activeOpacity={
                                                0.8
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.createButtonText
                                                }
                                            >
                                                Create Announcement
                                            </Text>

                                        </TouchableOpacity>

                                    </View>
                                )}


                            {/* SELECT COMMUNITY MESSAGE */}

                            {!selectedCommunity && (
                                <View
                                    style={
                                        styles.selectMessage
                                    }
                                >

                                    <Text
                                        style={
                                            styles.selectMessageIcon
                                        }
                                    >
                                        📢
                                    </Text>

                                    <Text
                                        style={
                                            styles.selectMessageTitle
                                        }
                                    >
                                        Select a Community
                                    </Text>

                                    <Text
                                        style={
                                            styles.selectMessageText
                                        }
                                    >
                                        Choose a community above
                                        to view and manage its
                                        announcements.
                                    </Text>

                                </View>
                            )}

                        </View>
                    }

                    ListEmptyComponent={
                        selectedCommunity &&
                        !loadingAnnouncements &&
                        announcements.length ===
                            0
                            ? null
                            : null
                    }
                />

            )}

        </View>
    );
};

export default AnnouncementsScreen;


// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F3F0FF",
    },

    header: {
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#433878",
    },

    subtitle: {
        fontSize: 15,
        color: "#6B647D",
        marginTop: 6,
        lineHeight: 21,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 12,
    },

    communityList: {
        paddingBottom: 18,
        paddingRight: 20,
    },

    communityCard: {
        width: 190,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 15,
        marginRight: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E0F5",
    },

    selectedCommunityCard: {
        borderColor: "#7C3AED",
        backgroundColor: "#FAF8FF",
        borderWidth: 2,
    },

    communityIcon: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#E9E3FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    communityIconText: {
        fontSize: 22,
    },

    communityInfo: {
        flex: 1,
    },

    communityName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#433878",
    },

    communityCategory: {
        fontSize: 13,
        color: "#6B647D",
        marginTop: 3,
    },

    memberText: {
        fontSize: 12,
        color: "#7A718C",
        marginTop: 3,
    },

    selectedBadge: {
        position: "absolute",
        right: 8,
        top: 8,
        width: 23,
        height: 23,
        borderRadius: 12,
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
    },

    selectedBadgeText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    selectedHeader: {
        backgroundColor: "#E9E3FF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectedLabel: {
        fontSize: 13,
        color: "#6B647D",
        marginBottom: 3,
    },

    selectedName: {
        fontSize: 19,
        fontWeight: "700",
        color: "#433878",
        maxWidth: 220,
    },

    createSmallButton: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },

    createSmallButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    list: {
        paddingHorizontal: 20,
    },

    announcementCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    titleContainer: {
        flex: 1,
    },

    announcementTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#433878",
        lineHeight: 26,
    },

    pinned: {
        fontSize: 13,
        fontWeight: "600",
        color: "#92400E",
        marginTop: 7,
    },

    content: {
        fontSize: 16,
        lineHeight: 24,
        color: "#57516A",
        marginTop: 12,
    },

    date: {
        fontSize: 13,
        color: "#81798F",
        marginTop: 12,
    },

    actions: {
        flexDirection: "row",
        marginTop: 16,
    },

    editButton: {
        flex: 1,
        minHeight: 46,
        borderWidth: 1.5,
        borderColor: "#7C3AED",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },

    editText: {
        color: "#7C3AED",
        fontWeight: "700",
        fontSize: 15,
    },

    deleteButton: {
        flex: 1,
        minHeight: 46,
        borderWidth: 1.5,
        borderColor: "#F1B8B3",
        backgroundColor: "#FFF5F4",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 6,
    },

    deleteText: {
        color: "#B42318",
        fontWeight: "700",
        fontSize: 15,
    },

    announcementLoading: {
        alignItems: "center",
        paddingVertical: 40,
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6B647D",
    },

    emptyAnnouncement: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 28,
        alignItems: "center",
        marginTop: 5,
    },

    emptyAnnouncementIcon: {
        fontSize: 48,
        marginBottom: 12,
    },

    emptyAnnouncementTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 7,
    },

    emptyAnnouncementText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#6B647D",
        textAlign: "center",
        marginBottom: 20,
    },

    createButton: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 22,
        paddingVertical: 13,
        borderRadius: 10,
    },

    createButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    selectMessage: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 30,
        alignItems: "center",
        marginTop: 5,
    },

    selectMessageIcon: {
        fontSize: 48,
        marginBottom: 12,
    },

    selectMessageTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 8,
    },

    selectMessageText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#6B647D",
        textAlign: "center",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 55,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 23,
        fontWeight: "700",
        color: "#433878",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 16,
        color: "#6B647D",
        textAlign: "center",
        lineHeight: 23,
        marginBottom: 25,
    },

    createCommunityButton: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
    },

    createCommunityButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F0FF",
    },

});