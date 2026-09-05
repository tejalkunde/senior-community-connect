import express from "express";

import {
    getAnnouncements,
    createAnnouncement
} from "../controllers/announcementController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/communities/:communityId/announcements",
    authenticate,
    getAnnouncements
);

router.post(
    "/communities/:communityId/announcements",
    authenticate,
    authorize("OWNER", "ADMIN"),
    createAnnouncement
);

export default router;