import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", membershipRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api", announcementRoutes);

app.use("/api", messageRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Senior Community Connect API is running"
    });
});

app.use("/api/communities", communityRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});