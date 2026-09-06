import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketAuthenticate = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(
                new Error("Authentication required")
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decoded.id
        ).select("-password");

        if (!user) {
            return next(
                new Error("User not found")
            );
        }

        if (!user.isActive) {
            return next(
                new Error("Account is inactive")
            );
        }

        socket.user = user;

        next();

    } catch (error) {
        console.error(
            "Socket authentication error:",
            error.message
        );

        next(
            new Error("Invalid or expired token")
        );
    }
};

export default socketAuthenticate;