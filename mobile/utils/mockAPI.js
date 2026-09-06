import {
    mockUsers,
    mockCommunities,
    mockAnnouncements,
    mockMessages,
    mockMembers,
} from "./mockData";

/*
=====================================================
MOCK API
=====================================================

This temporarily behaves like the backend.

When:
    MOCK_MODE = true

the app uses this file instead of the real server.

When backend is ready:
    MOCK_MODE = false

and api.js will use Axios normally.
=====================================================
*/

const createResponse = (data) => {
    return {
        data,
    };
};

/* =====================================================
   GET
===================================================== */

const get = async (url) => {
    console.log("MOCK GET:", url);

    /* COMMUNITIES */

    if (url === "/communities") {
        return createResponse({
            communities: mockCommunities,
        });
    }

    /* MY COMMUNITIES */

    if (url === "/communities/my") {
        return createResponse({
            communities:
                mockCommunities.filter(
                    (community) =>
                        community.isMember
                ),
        });
    }

    /* COMMUNITY DETAILS */

    const communityMatch = url.match(
        /^\/communities\/([^/]+)$/
    );

    if (communityMatch) {
        const communityId =
            communityMatch[1];

        const community =
            mockCommunities.find(
                (item) =>
                    item._id === communityId
            );

        if (!community) {
            throw {
                response: {
                    data: {
                        message:
                            "Community not found.",
                    },
                },
            };
        }

        return createResponse({
            community,
        });
    }

    /* MEMBERS */

    const membersMatch = url.match(
        /^\/communities\/([^/]+)\/members$/
    );

    if (membersMatch) {
        return createResponse({
            members: mockMembers,
        });
    }

    /* ANNOUNCEMENTS */

    const announcementsMatch = url.match(
        /^\/communities\/([^/]+)\/announcements$/
    );

    if (announcementsMatch) {
        const communityId =
            announcementsMatch[1];

        const announcements =
            mockAnnouncements.filter(
                (announcement) =>
                    announcement.communityId ===
                    communityId
            );

        return createResponse({
            announcements,
        });
    }

    /* MESSAGES */

    const messagesMatch = url.match(
        /^\/communities\/([^/]+)\/messages$/
    );

    if (messagesMatch) {
        const communityId =
            messagesMatch[1];

        const messages =
            mockMessages.filter(
                (message) =>
                    message.communityId ===
                    communityId
            );

        return createResponse({
            messages,
        });
    }

    throw new Error(
        `Mock GET route not found: ${url}`
    );
};


/* =====================================================
   POST
===================================================== */

const post = async (
    url,
    body = {}
) => {
    console.log(
        "MOCK POST:",
        url,
        body
    );

    /* LOGIN */

    if (url === "/auth/login") {
        const isOwner =
            body.email ===
            "owner@example.com";

        const user = isOwner
            ? mockUsers.owner
            : mockUsers.senior;

        return createResponse({
            token: "mock-token-123",
            user,
        });
    }

    /* REGISTER */

    if (url === "/auth/register") {
        const role =
            body.role || "SENIOR";

        const user = {
            _id:
                role === "OWNER"
                    ? "new-owner"
                    : "new-senior",

            name:
                body.name ||
                "New User",

            email:
                body.email ||
                "user@example.com",

            role,
        };

        return createResponse({
            message:
                "Registration successful.",
            user,
            token: "mock-token-456",
        });
    }

    /* JOIN COMMUNITY */

    const joinMatch = url.match(
        /^\/communities\/([^/]+)\/join$/
    );

    if (joinMatch) {
        const communityId =
            joinMatch[1];

        const community =
            mockCommunities.find(
                (item) =>
                    item._id ===
                    communityId
            );

        if (!community) {
            throw new Error(
                "Community not found."
            );
        }

        community.isMember = true;
        community.memberCount += 1;

        return createResponse({
            message:
                "Joined community successfully.",
            community,
        });
    }

    /* CREATE COMMUNITY */

    if (url === "/communities") {
        const newCommunity = {
            _id:
                "community-" +
                Date.now(),

            name:
                body.name ||
                "New Community",

            description:
                body.description ||
                "",

            category:
                body.category ||
                "General",

            status: "PENDING",

            memberCount: 0,

            isMember: false,
        };

        mockCommunities.push(
            newCommunity
        );

        return createResponse({
            message:
                "Community created successfully.",
            community:
                newCommunity,
        });
    }

    /* CREATE ANNOUNCEMENT */

    const announcementMatch =
        url.match(
            /^\/communities\/([^/]+)\/announcements$/
        );

    if (announcementMatch) {
        const communityId =
            announcementMatch[1];

        const newAnnouncement = {
            _id:
                "announcement-" +
                Date.now(),

            communityId,

            title:
                body.title ||
                "New Announcement",

            content:
                body.content ||
                "",

            createdAt:
                new Date().toISOString(),
        };

        mockAnnouncements.unshift(
            newAnnouncement
        );

        return createResponse({
            message:
                "Announcement created successfully.",

            announcement:
                newAnnouncement,
        });
    }

    /* SEND MESSAGE */

    const messageMatch = url.match(
        /^\/communities\/([^/]+)\/messages$/
    );

    if (messageMatch) {
        const communityId =
            messageMatch[1];

        const newMessage = {
            _id:
                "message-" +
                Date.now(),

            communityId,

            sender: {
                _id:
                    mockUsers.senior._id,

                name:
                    mockUsers.senior.name,
            },

            senderId:
                mockUsers.senior._id,

            content:
                body.content || "",

            createdAt:
                new Date().toISOString(),
        };

        mockMessages.push(
            newMessage
        );

        return createResponse({
            message:
                "Message sent successfully.",

            data: newMessage,
        });
    }

    /* REGISTER NOTIFICATION TOKEN */

    if (
        url ===
        "/notifications/register-token"
    ) {
        return createResponse({
            message:
                "Notification token registered successfully.",
        });
    }

    throw new Error(
        `Mock POST route not found: ${url}`
    );
};


/* =====================================================
   PUT
===================================================== */

const put = async (
    url,
    body = {}
) => {
    console.log(
        "MOCK PUT:",
        url,
        body
    );

    /* UPDATE COMMUNITY */

    const communityMatch = url.match(
        /^\/communities\/([^/]+)$/
    );

    if (communityMatch) {
        const communityId =
            communityMatch[1];

        const index =
            mockCommunities.findIndex(
                (item) =>
                    item._id ===
                    communityId
            );

        if (index === -1) {
            throw new Error(
                "Community not found."
            );
        }

        mockCommunities[index] = {
            ...mockCommunities[index],
            ...body,
        };

        return createResponse({
            message:
                "Community updated successfully.",

            community:
                mockCommunities[index],
        });
    }

    /* UPDATE ANNOUNCEMENT */

    const announcementMatch =
        url.match(
            /^\/announcements\/([^/]+)$/
        );

    if (announcementMatch) {
        const announcementId =
            announcementMatch[1];

        const index =
            mockAnnouncements.findIndex(
                (item) =>
                    item._id ===
                    announcementId
            );

        if (index === -1) {
            throw new Error(
                "Announcement not found."
            );
        }

        mockAnnouncements[index] = {
            ...mockAnnouncements[index],
            ...body,
        };

        return createResponse({
            message:
                "Announcement updated successfully.",

            announcement:
                mockAnnouncements[index],
        });
    }

    throw new Error(
        `Mock PUT route not found: ${url}`
    );
};


/* =====================================================
   DELETE
===================================================== */

const del = async (url) => {
    console.log(
        "MOCK DELETE:",
        url
    );

    /* LEAVE COMMUNITY */

    const leaveMatch = url.match(
        /^\/communities\/([^/]+)\/leave$/
    );

    if (leaveMatch) {
        const communityId =
            leaveMatch[1];

        const community =
            mockCommunities.find(
                (item) =>
                    item._id ===
                    communityId
            );

        if (community) {
            community.isMember = false;

            if (
                community.memberCount >
                0
            ) {
                community.memberCount -=
                    1;
            }
        }

        return createResponse({
            message:
                "Left community successfully.",
        });
    }

    /* DELETE COMMUNITY */

    const communityMatch = url.match(
        /^\/communities\/([^/]+)$/
    );

    if (communityMatch) {
        const communityId =
            communityMatch[1];

        const index =
            mockCommunities.findIndex(
                (item) =>
                    item._id ===
                    communityId
            );

        if (index !== -1) {
            mockCommunities.splice(
                index,
                1
            );
        }

        return createResponse({
            message:
                "Community deleted successfully.",
        });
    }

    /* REMOVE MEMBER */

    const memberMatch = url.match(
        /^\/communities\/([^/]+)\/members\/([^/]+)$/
    );

    if (memberMatch) {
        return createResponse({
            message:
                "Member removed successfully.",
        });
    }

    /* DELETE ANNOUNCEMENT */

    const announcementMatch =
        url.match(
            /^\/announcements\/([^/]+)$/
        );

    if (announcementMatch) {
        const announcementId =
            announcementMatch[1];

        const index =
            mockAnnouncements.findIndex(
                (item) =>
                    item._id ===
                    announcementId
            );

        if (index !== -1) {
            mockAnnouncements.splice(
                index,
                1
            );
        }

        return createResponse({
            message:
                "Announcement deleted successfully.",
        });
    }

    throw new Error(
        `Mock DELETE route not found: ${url}`
    );
};


const mockAPI = {
    get,
    post,
    put,
    delete: del,
};

export default mockAPI;