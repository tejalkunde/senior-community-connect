import User from "../models/User.js";
import Community from "../models/Community.js";


// GET ALL COMMUNITIES FOR ADMIN
export const getAdminCommunities = async (req, res) => {
    try {
        const {
            search,
            status,
            category
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status.toUpperCase();
        }

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
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// APPROVE
export const approveCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        community.status = "APPROVED";
        community.rejectionReason = "";

        await community.save();

        res.status(200).json({
            success: true,
            message: "Community approved",
            data: community
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// REJECT
export const rejectCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        community.status = "REJECTED";
        community.rejectionReason =
            req.body.rejectionReason || "";

        await community.save();

        res.status(200).json({
            success: true,
            message: "Community rejected",
            data: community
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getAdminUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const getAdminUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent accidentally disabling admins
        if (user.role === "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Admin status cannot be changed here"
            });
        }

        user.isActive = Boolean(isActive);

        await user.save();

        res.status(200).json({
            success: true,
            message: "User status updated",
            data: {
                id: user._id,
                isActive: user.isActive
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            seniorCitizens,
            communityOwners,
            totalCommunities,
            pendingCommunities,
            approvedCommunities
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                role: "SENIOR"
            }),

            User.countDocuments({
                role: "OWNER"
            }),

            Community.countDocuments(),

            Community.countDocuments({
                status: "PENDING"
            }),

            Community.countDocuments({
                status: "APPROVED"
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                seniorCitizens,
                communityOwners,
                totalCommunities,
                pendingCommunities,
                approvedCommunities
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};