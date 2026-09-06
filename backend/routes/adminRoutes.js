import express from "express";

import {
    getAdminCommunities,
    approveCommunity,
    rejectCommunity,
    getAdminUsers,
    getAdminUser,
    updateUserStatus,
    getDashboardStats
} from "../controllers/adminController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/communities", getAdminCommunities);

router.patch(
    "/communities/:id/approve",
    approveCommunity
);

router.patch(
    "/communities/:id/reject",
    rejectCommunity
);
router.get("/users", getAdminUsers);

router.get("/users/:id", getAdminUser);

router.patch(
    "/users/:id/status",
    updateUserStatus
);

router.get(
    "/dashboard",
    getDashboardStats
);

export default router;