import express from "express";

import {
    joinCommunity,
    leaveCommunity,
    getMyJoinedCommunities
} from "../controllers/membershipController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/communities/:id/join",
    authenticate,
    authorize("SENIOR"),
    joinCommunity
);

router.delete(
    "/communities/:id/leave",
    authenticate,
    authorize("SENIOR"),
    leaveCommunity
);

router.get(
    "/communities/my",
    authenticate,
    authorize("SENIOR"),
    getMyJoinedCommunities
);

export default router;