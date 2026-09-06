export const mockUsers = {
    senior: {
        _id: "senior123",
        name: "Ramesh Sharma",
        email: "ramesh@example.com",
        role: "SENIOR",
    },

    owner: {
        _id: "owner123",
        name: "Anita Verma",
        email: "anita@example.com",
        role: "OWNER",
    },
};

export const mockCommunities = [
    {
        _id: "community1",
        name: "Healthy Seniors",
        description:
            "A community for senior citizens interested in health, yoga and fitness.",
        category: "Health",
        status: "APPROVED",
        memberCount: 45,
        isMember: true,
    },

    {
        _id: "community2",
        name: "Morning Walk Group",
        description:
            "A friendly community for morning walks and outdoor activities.",
        category: "Fitness",
        status: "APPROVED",
        memberCount: 32,
        isMember: false,
    },

    {
        _id: "community3",
        name: "Book Lovers",
        description:
            "Discuss books, authors and your favorite stories.",
        category: "Reading",
        status: "APPROVED",
        memberCount: 28,
        isMember: false,
    },

    {
        _id: "community4",
        name: "Music & Memories",
        description:
            "Share songs, memories and enjoy music together.",
        category: "Music",
        status: "APPROVED",
        memberCount: 21,
        isMember: true,
    },
];

export const mockAnnouncements = [
    {
        _id: "announcement1",
        communityId: "community1",
        title: "Sunday Yoga Session",
        content:
            "Yoga session will be held this Sunday at 7:00 AM in the community hall.",
        createdAt: "2026-09-05T07:00:00.000Z",
    },

    {
        _id: "announcement2",
        communityId: "community1",
        title: "Health Checkup Camp",
        content:
            "A free health checkup camp will be organized next Saturday.",
        createdAt: "2026-09-03T10:30:00.000Z",
    },

    {
        _id: "announcement3",
        communityId: "community4",
        title: "Music Evening",
        content:
            "Join us for a special music evening this Friday at 6 PM.",
        createdAt: "2026-09-02T15:00:00.000Z",
    },
];

export const mockMessages = [
    {
        _id: "message1",
        communityId: "community1",
        sender: {
            _id: "user1",
            name: "Suresh",
        },
        content:
            "Good morning everyone!",
        createdAt: "2026-09-05T07:10:00.000Z",
    },

    {
        _id: "message2",
        communityId: "community1",
        sender: {
            _id: "senior123",
            name: "Ramesh Sharma",
        },
        content:
            "Good morning! Looking forward to the yoga session.",
        createdAt: "2026-09-05T07:12:00.000Z",
    },

    {
        _id: "message3",
        communityId: "community1",
        sender: {
            _id: "user2",
            name: "Meena",
        },
        content:
            "I will also join. See you all there!",
        createdAt: "2026-09-05T07:15:00.000Z",
    },
];

export const mockMembers = [
    {
        _id: "user1",
        name: "Suresh Kumar",
        email: "suresh@example.com",
        role: "SENIOR",
    },

    {
        _id: "user2",
        name: "Meena Patel",
        email: "meena@example.com",
        role: "SENIOR",
    },

    {
        _id: "user3",
        name: "Rajesh Singh",
        email: "rajesh@example.com",
        role: "SENIOR",
    },
];