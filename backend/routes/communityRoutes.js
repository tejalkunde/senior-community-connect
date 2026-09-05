import express from "express";

import {
    getCommunities,
    getCommunity,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    getMyCommunities
} from "../controllers/communityController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCommunities);

router.get(
    "/my",
    authenticate,
    authorize("OWNER"),
    getMyCommunities
);

router.get("/:id", authenticate, getCommunity);

router.post(
    "/",
    authenticate,
    authorize("OWNER", "ADMIN"),
    createCommunity
);

router.put(
    "/:id",
    authenticate,
    authorize("OWNER", "ADMIN"),
    updateCommunity
);

router.delete(
    "/:id",
    authenticate,
    authorize("OWNER", "ADMIN"),
    deleteCommunity
);

export default router;