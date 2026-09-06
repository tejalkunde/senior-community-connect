import Community from "../models/Community.js";
import Membership from "../models/Membership.js";

/* =========================================================
   GET APPROVED COMMUNITIES
========================================================= */
export const getCommunities = async (req, res) => {
    try {
        const { search, category } = req.query;

        const filter = {
            status: "APPROVED",
        };

        if (category) {
            filter.category = category.toUpperCase();
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const communities = await Community.find(filter)
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        const communitiesWithCount = await Promise.all(
            communities.map(async (community) => {
                const memberCount = await Membership.countDocuments({
                    community: community._id,
                });

                return {
                    ...community.toObject(),
                    memberCount,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: communitiesWithCount,
        });
    } catch (error) {
        console.error("Get communities error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* =========================================================
   GET SINGLE COMMUNITY
========================================================= */
export const getCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate("owner", "name email");

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // Seniors can only see approved communities
        if (
            req.user.role === "SENIOR" &&
            community.status !== "APPROVED"
        ) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        const memberCount = await Membership.countDocuments({
            community: community._id,
        });

        let isMember = false;

        if (req.user.role === "SENIOR") {
            const membership = await Membership.findOne({
                user: req.user._id,
                community: community._id,
            });

            isMember = !!membership;
        }

        res.status(200).json({
            success: true,
            data: {
                ...community.toObject(),
                memberCount,
                isMember,
            },
        });
    } catch (error) {
        console.error("Get community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* =========================================================
   CREATE COMMUNITY
========================================================= */
export const createCommunity = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            image,
        } = req.body;

        if (!name || !description || !category) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, description and category are required",
            });
        }

        const community = await Community.create({
            name,
            description,
            category: category.toUpperCase(),
            image: image || "",
            owner: req.user._id,
            status: "PENDING",
        });

        res.status(201).json({
            success: true,
            message: "Community submitted for approval",
            data: community,
        });
    } catch (error) {
        console.error("Create community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* =========================================================
   UPDATE COMMUNITY
========================================================= */
export const updateCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // OWNER can update only their own community
        if (
            req.user.role === "OWNER" &&
            community.owner.toString() !==
                req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot modify this community",
            });
        }

        const {
            name,
            description,
            category,
            image,
        } = req.body;

        if (name !== undefined) {
            community.name = name;
        }

        if (description !== undefined) {
            community.description = description;
        }

        if (category !== undefined) {
            community.category = category.toUpperCase();
        }

        if (image !== undefined) {
            community.image = image;
        }

        // Owner updates require admin approval again
        if (req.user.role === "OWNER") {
            community.status = "PENDING";
        }

        await community.save();

        res.status(200).json({
            success: true,
            message: "Community updated",
            data: community,
        });
    } catch (error) {
        console.error("Update community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* =========================================================
   DELETE COMMUNITY
========================================================= */
export const deleteCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // OWNER can delete only their own community
        if (
            req.user.role === "OWNER" &&
            community.owner.toString() !==
                req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this community",
            });
        }

        // Delete all memberships first
        await Membership.deleteMany({
            community: community._id,
        });

        await community.deleteOne();

        res.status(200).json({
            success: true,
            message: "Community deleted",
        });
    } catch (error) {
        console.error("Delete community error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* =========================================================
   GET OWNER'S COMMUNITIES
========================================================= */
export const getMyCommunities = async (req, res) => {
    try {
        const communities = await Community.find({
            owner: req.user._id,
        }).sort({ createdAt: -1 });

        const communitiesWithCount = await Promise.all(
            communities.map(async (community) => {
                const memberCount =
                    await Membership.countDocuments({
                        community: community._id,
                    });

                return {
                    ...community.toObject(),
                    memberCount,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: communitiesWithCount,
        });
    } catch (error) {
        console.error(
            "Get my communities error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* =========================================================
   GET COMMUNITY MEMBERS
========================================================= */
export const getCommunityMembers = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("\n========== GET COMMUNITY MEMBERS ==========");
        console.log("Community ID:", id);
        console.log("Logged-in User:", req.user?._id);
        console.log("Logged-in Role:", req.user?.role);

        // Find community
        const community = await Community.findById(id);

        if (!community) {
            console.log("Community not found");

            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        console.log(
            "Community Owner:",
            community.owner.toString()
        );

        // OWNER can access only their own community
        if (req.user.role === "OWNER") {
            if (
                community.owner.toString() !==
                req.user._id.toString()
            ) {
                console.log(
                    "OWNER tried to access another owner's community"
                );

                return res.status(403).json({
                    success: false,
                    message:
                        "You are not the owner of this community",
                });
            }
        }

        // ADMIN can access any community

        const memberships = await Membership.find({
            community: community._id,
        })
            .populate(
                "user",
                "name email profileImage role"
            )
            .sort({
                joinedAt: -1,
            });

        console.log(
            "Membership records found:",
            memberships.length
        );

        const members = memberships
            .filter((membership) => membership.user)
            .map((membership) => ({
                _id: membership.user._id,
                name: membership.user.name,
                email: membership.user.email,
                profileImage:
                    membership.user.profileImage || "",
                role: membership.user.role,
                joinedAt: membership.joinedAt,
            }));

        console.log(
            "Members returned:",
            members.length
        );

        console.log(
            "==========================================\n"
        );

        return res.status(200).json({
            success: true,
            data: members,
        });
    } catch (error) {
        console.error(
            "Get community members error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load community members",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};


/* =========================================================
   REMOVE COMMUNITY MEMBER
========================================================= */
export const removeCommunityMember = async (
    req,
    res
) => {
    try {
        const { id, userId } = req.params;

        console.log("\n========== REMOVE COMMUNITY MEMBER ==========");
        console.log("Community ID:", id);
        console.log("User ID:", userId);
        console.log("Logged-in User:", req.user?._id);
        console.log("Logged-in Role:", req.user?.role);

        const community =
            await Community.findById(id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // OWNER can remove members only from their own community
        if (req.user.role === "OWNER") {
            if (
                community.owner.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not the owner of this community",
                });
            }
        }

        const membership =
            await Membership.findOne({
                community: community._id,
                user: userId,
            });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message:
                    "This user is not a member of this community",
            });
        }

        await membership.deleteOne();

        console.log("Member removed successfully");
        console.log(
            "============================================\n"
        );

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });
    } catch (error) {
        console.error(
            "Remove community member error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to remove member",
        });
    }
};