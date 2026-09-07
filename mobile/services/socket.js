import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = "http://10.1.26.110:5000";

let socket = null;

export const connectSocket = async () => {
    try {
        // Reuse existing socket
        if (socket?.connected) {
            return socket;
        }

        const token = await AsyncStorage.getItem("token");

        console.log("Socket token exists:", !!token);

        if (!token) {
            console.log("No JWT token found for Socket.IO");
            return null;
        }

        socket = io(SOCKET_URL, {
            transports: ["websocket"],

            auth: {
                token,
            },

            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
            console.log("=================================");
            console.log("Socket connected successfully");
            console.log("Socket ID:", socket.id);
            console.log("=================================");
        });

        socket.on("connect_error", (error) => {
            console.log(
                "Socket connection error:",
                error.message
            );
        });

        socket.on("disconnect", (reason) => {
            console.log(
                "Socket disconnected:",
                reason
            );
        });

        return socket;

    } catch (error) {
        console.log(
            "Socket connection setup error:",
            error
        );

        return null;
    }
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};