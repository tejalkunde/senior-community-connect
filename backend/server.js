import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import socketAuthenticate from "./middleware/socketAuthMiddleware.js";

import Community from "./models/Community.js";
import Membership from "./models/Membership.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", membershipRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api", announcementRoutes);

app.use("/api", messageRoutes);

app.use("/api/communities", communityRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Senior Community Connect API is running"
    });
});


// ==========================================
// SOCKET.IO AUTHENTICATION
// ==========================================

io.use(socketAuthenticate);


// ==========================================
// SOCKET.IO CONNECTION
// ==========================================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.user.name,
        "| Socket ID:",
        socket.id
    );


    // ======================================
    // JOIN COMMUNITY
    // ======================================

    socket.on("joinCommunity", async (communityId) => {

        try {

            const community = await Community.findById(
                communityId
            );

            if (!community) {

                return socket.emit(
                    "socketError",
                    {
                        message: "Community not found"
                    }
                );

            }


            if (community.status !== "APPROVED") {

                return socket.emit(
                    "socketError",
                    {
                        message: "Community is not available"
                    }
                );

            }


            const membership = await Membership.findOne({
                user: socket.user._id,
                community: communityId
            });


            const isOwner =
                community.owner.toString() ===
                socket.user._id.toString();


            if (!membership && !isOwner) {

                return socket.emit(
                    "socketError",
                    {
                        message:
                            "You are not a member of this community"
                    }
                );

            }


            socket.join(
                `community:${communityId}`
            );


            console.log(
                `${socket.user.name} joined community ${communityId}`
            );


            socket.emit(
                "communityJoined",
                {
                    communityId,
                    message:
                        "Successfully joined community"
                }
            );

        } catch (error) {

            console.error(
                "Join community socket error:",
                error
            );

            socket.emit(
                "socketError",
                {
                    message: "Unable to join community"
                }
            );

        }

    });


    // ======================================
    // LEAVE COMMUNITY
    // ======================================

    socket.on("leaveCommunity", (communityId) => {

        socket.leave(
            `community:${communityId}`
        );

        console.log(
            `${socket.user.name} left community ${communityId}`
        );

    });


    // ======================================
    // SEND MESSAGE
    // ======================================

    socket.on(
        "sendMessage",
        async ({ communityId, content }) => {

            try {

                // Validate message
                if (
                    !content ||
                    !content.trim()
                ) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "Message cannot be empty"
                        }
                    );

                }


                // Check community
                const community =
                    await Community.findById(
                        communityId
                    );

                if (!community) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "Community not found"
                        }
                    );

                }


                // Check community status
                if (
                    community.status !==
                    "APPROVED"
                ) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "Community is not available"
                        }
                    );

                }


                // Check membership
                const membership =
                    await Membership.findOne({
                        user: socket.user._id,
                        community: communityId
                    });


                const isOwner =
                    community.owner.toString() ===
                    socket.user._id.toString();


                if (!membership && !isOwner) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "Join the community first"
                        }
                    );

                }


                // Save message to MongoDB
                const message =
                    await Message.create({
                        community:
                            community._id,

                        sender:
                            socket.user._id,

                        content:
                            content.trim()
                    });


                // Populate sender information
                await message.populate(
                    "sender",
                    "name profileImage"
                );


                // Broadcast saved message
                io.to(
                    `community:${communityId}`
                ).emit(
                    "newMessage",
                    message
                );


                console.log(
                    `${socket.user.name} sent message in ${communityId}`
                );

            } catch (error) {

                console.error(
                    "Send message socket error:",
                    error
                );

                socket.emit(
                    "socketError",
                    {
                        message:
                            "Unable to send message"
                    }
                );

            }

        }
    );


    // ======================================
    // DISCONNECT
    // ======================================

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.user.name,
            "| Socket ID:",
            socket.id
        );

    });

});
    

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});