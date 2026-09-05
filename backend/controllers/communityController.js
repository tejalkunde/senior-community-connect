import Community from "../models/Community.js";
import Membership from "../models/Membership.js";


// GET APPROVED COMMUNITIES
export const getCommunities = async (req, res) => {
    try {
        const { search, category } = req.query;

        const filter = {
            status: "APPROVED"
        };

        if (category) {
            filter.category = category.toUpperCase();
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const communities = await Community.find(filter)
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: communities
        });

    } catch (error) {
        console.error("Get communities error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET SINGLE COMMUNITY
export const getCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate("owner", "name email");

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        // Seniors should only see approved communities
        if (
            req.user.role === "SENIOR" &&
            community.status !== "APPROVED"
        ) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        res.status(200).json({
            success: true,
            data: community
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// CREATE COMMUNITY
export const createCommunity = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            image
        } = req.body;

        if (!name || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, description and category are required"
            });
        }

        const community = await Community.create({
            name,
            description,
            category: category.toUpperCase(),
            image,
            owner: req.user._id,

            // Owner-created communities require admin approval
            status: "PENDING"
        });

        res.status(201).json({
            success: true,
            message: "Community submitted for approval",
            data: community
        });

    } catch (error) {
        console.error("Create community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// UPDATE COMMUNITY
export const updateCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        // Owner can only modify their own community
        if (
            req.user.role === "OWNER" &&
            community.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot modify this community"
            });
        }

        const {
            name,
            description,
            category,
            image
        } = req.body;

        if (name !== undefined) community.name = name;
        if (description !== undefined) community.description = description;
        if (category !== undefined) {
            community.category = category.toUpperCase();
        }
        if (image !== undefined) community.image = image;

        // If owner edits an approved community,
        // send it back for admin review.
        if (req.user.role === "OWNER") {
            community.status = "PENDING";
        }

        await community.save();

        res.status(200).json({
            success: true,
            message: "Community updated",
            data: community
        });

    } catch (error) {
        console.error("Update community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// DELETE COMMUNITY
export const deleteCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        if (
            req.user.role === "OWNER" &&
            community.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this community"
            });
        }

        await Membership.deleteMany({
            community: community._id
        });

        await community.deleteOne();

        res.status(200).json({
            success: true,
            message: "Community deleted"
        });

    } catch (error) {
        console.error("Delete community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// OWNER'S COMMUNITIES
export const getMyCommunities = async (req, res) => {
    try {
        const communities = await Community.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: communities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};