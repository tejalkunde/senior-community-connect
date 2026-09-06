import express from "express";

import {
    getCommunities,
    getCommunity,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    getMyCommunities,
    getCommunityMembers,
    removeCommunityMember,
} from "../controllers/communityController.js";

import authenticate from "../middleware/authMiddleware.js";

import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


/* =====================================================
   GET APPROVED COMMUNITIES
===================================================== */

router.get(
    "/",
    authenticate,
    getCommunities
);


/* =====================================================
   OWNER'S COMMUNITIES
===================================================== */

router.get(
    "/my",
    authenticate,
    authorize("OWNER"),
    getMyCommunities
);


/* =====================================================
   COMMUNITY MEMBERS
===================================================== */

/*
   Get all members of a community

   GET
   /api/communities/:id/members
*/

router.get(
    "/:id/members",
    authenticate,
    authorize("OWNER", "ADMIN"),
    getCommunityMembers
);


/*
   Remove a member from a community

   DELETE
   /api/communities/:id/members/:userId
*/

router.delete(
    "/:id/members/:userId",
    authenticate,
    authorize("OWNER", "ADMIN"),
    removeCommunityMember
);


/* =====================================================
   GET SINGLE COMMUNITY
===================================================== */

router.get(
    "/:id",
    authenticate,
    getCommunity
);


/* =====================================================
   CREATE COMMUNITY
===================================================== */

router.post(
    "/",
    authenticate,
    authorize("OWNER", "ADMIN"),
    createCommunity
);


/* =====================================================
   UPDATE COMMUNITY
===================================================== */

router.put(
    "/:id",
    authenticate,
    authorize("OWNER", "ADMIN"),
    updateCommunity
);


/* =====================================================
   DELETE COMMUNITY
===================================================== */

router.delete(
    "/:id",
    authenticate,
    authorize("OWNER", "ADMIN"),
    deleteCommunity
);


export default router;