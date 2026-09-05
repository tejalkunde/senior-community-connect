import Announcement from "../models/Announcement.js";
import Community from "../models/Community.js";
import Membership from "../models/Membership.js";


// GET ANNOUNCEMENTS
export const getAnnouncements = async (req, res) => {
    try {
        const community = await Community.findById(
            req.params.communityId
        );

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        const announcements = await Announcement.find({
            community: community._id
        })
            .populate("author", "name")
            .sort({
                isPinned: -1,
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            data: announcements
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// CREATE ANNOUNCEMENT
export const createAnnouncement = async (req, res) => {
    try {
        const {
            title,
            content
        } = req.body;

        const community = await Community.findById(
            req.params.communityId
        );

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        // Owner can only post in their own community
        if (
            req.user.role === "OWNER" &&
            community.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not own this community"
            });
        }

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const announcement = await Announcement.create({
            community: community._id,
            author: req.user._id,
            title,
            content
        });

        res.status(201).json({
            success: true,
            message: "Announcement created",
            data: announcement
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};