import Membership from "../models/Membership.js";
import Community from "../models/Community.js";


// JOIN
export const joinCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        if (community.status !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Community is not available"
            });
        }

        const existingMembership = await Membership.findOne({
            user: req.user._id,
            community: community._id
        });

        if (existingMembership) {
            return res.status(409).json({
                success: false,
                message: "Already a member"
            });
        }

        const membership = await Membership.create({
            user: req.user._id,
            community: community._id
        });

        res.status(201).json({
            success: true,
            message: "Joined community",
            data: membership
        });

    } catch (error) {
        console.error("Join community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// LEAVE
export const leaveCommunity = async (req, res) => {
    try {
        const membership = await Membership.findOne({
            user: req.user._id,
            community: req.params.id
        });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "You are not a member"
            });
        }

        await membership.deleteOne();

        res.status(200).json({
            success: true,
            message: "Left community"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// MY JOINED COMMUNITIES
export const getMyJoinedCommunities = async (req, res) => {
    try {
        const memberships = await Membership.find({
            user: req.user._id,
        })
            .populate("community")
            .sort({ joinedAt: -1 });

        const communitiesWithCount = await Promise.all(
            memberships
                .filter((membership) => membership.community)
                .map(async (membership) => {

                    const community = membership.community;

                    const memberCount =
                        await Membership.countDocuments({
                            community: community._id,
                        });

                    return {
                        ...community.toObject(),

                        // Add member count
                        memberCount,

                        // Extra information about current user
                        isMember: true,
                        joinedAt: membership.joinedAt,
                    };
                })
        );

        res.status(200).json({
            success: true,
            data: communitiesWithCount,
        });

    } catch (error) {

        console.error(
            "Get my joined communities error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

