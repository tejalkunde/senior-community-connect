import Message from "../models/Message.js";
import Membership from "../models/Membership.js";
import Community from "../models/Community.js";


export const getMessages = async (req, res) => {
    try {
        const membership = await Membership.findOne({
            user: req.user._id,
            community: req.params.communityId
        });

        if (!membership && req.user.role !== "OWNER") {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this community"
            });
        }

        const messages = await Message.find({
            community: req.params.communityId
        })
            .populate("sender", "name profileImage")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const createMessage = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        const membership = await Membership.findOne({
            user: req.user._id,
            community: req.params.communityId
        });

        if (!membership) {
            return res.status(403).json({
                success: false,
                message: "Join the community first"
            });
        }

        const community = await Community.findById(
            req.params.communityId
        );

        if (!community || community.status !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Community is not available"
            });
        }

        const message = await Message.create({
            community: community._id,
            sender: req.user._id,
            content: content.trim()
        });

        await message.populate(
            "sender",
            "name profileImage"
        );

        res.status(201).json({
            success: true,
            message: "Message sent",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};