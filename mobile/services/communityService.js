import API from "./api";

/* =====================================================
   COMMUNITY
===================================================== */

export const getCommunities = async () => {
    const response = await API.get(
        "/communities"
    );

    return response.data;
};


export const getCommunity = async (
    communityId
) => {
    const response = await API.get(
        `/communities/${communityId}`
    );

    return response.data;
};


export const createCommunity = async (
    communityData
) => {
    const response = await API.post(
        "/communities",
        communityData
    );

    return response.data;
};


export const updateCommunity = async (
    communityId,
    communityData
) => {
    const response = await API.put(
        `/communities/${communityId}`,
        communityData
    );

    return response.data;
};


export const deleteCommunity = async (
    communityId
) => {
    const response = await API.delete(
        `/communities/${communityId}`
    );

    return response.data;
};


/* =====================================================
   MEMBERSHIP
===================================================== */

export const joinCommunity = async (
    communityId
) => {
    const response = await API.post(
        `/communities/${communityId}/join`
    );

    return response.data;
};


export const leaveCommunity = async (
    communityId
) => {
    const response = await API.delete(
        `/communities/${communityId}/leave`
    );

    return response.data;
};


export const getMyCommunities = async () => {
    const response = await API.get(
        "/communities/my"
    );

    return response.data;
};


/* =====================================================
   MEMBERS
===================================================== */

export const getMembers = async (
    communityId
) => {
    const response = await API.get(
        `/communities/${communityId}/members`
    );

    return response.data;
};


export const removeMember = async (
    communityId,
    userId
) => {
    const response = await API.delete(
        `/communities/${communityId}/members/${userId}`
    );

    return response.data;
};


/* =====================================================
   ANNOUNCEMENTS
===================================================== */

export const getAnnouncements = async (
    communityId
) => {
    const response = await API.get(
        `/communities/${communityId}/announcements`
    );

    return response.data;
};


export const createAnnouncement = async (
    communityId,
    announcementData
) => {
    const response = await API.post(
        `/communities/${communityId}/announcements`,
        announcementData
    );

    return response.data;
};


export const updateAnnouncement = async (
    announcementId,
    announcementData
) => {
    const response = await API.put(
        `/announcements/${announcementId}`,
        announcementData
    );

    return response.data;
};


export const deleteAnnouncement = async (
    announcementId
) => {
    const response = await API.delete(
        `/announcements/${announcementId}`
    );

    return response.data;
};


/* =====================================================
   MESSAGES
===================================================== */

export const getMessages = async (
    communityId
) => {
    const response = await API.get(
        `/communities/${communityId}/messages`
    );

    return response.data;
};


export const sendMessage = async (
    communityId,
    content
) => {
    const response = await API.post(
        `/communities/${communityId}/messages`,
        {
            content,
        }
    );

    return response.data;
};