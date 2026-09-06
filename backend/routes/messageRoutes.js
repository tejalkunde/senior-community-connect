import express from "express";

import {
    getMessages,
    createMessage
} from "../controllers/messageController.js";

import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/communities/:communityId/messages",
    authenticate,
    getMessages
);

router.post(
    "/communities/:communityId/messages",
    authenticate,
    createMessage
);

export default router;