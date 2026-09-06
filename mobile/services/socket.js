
import { io } from "socket.io-client";

import { getToken } from "../utils/storage";

const SOCKET_URL = "http://10.1.26.110:5000";

let socket = null;

export const connectSocket = async () => {
    try {
        const token = await getToken();

        console.log(
            "Socket token exists:",
            !!token
        );

        if (!token) {
            console.log(
                "No authentication token found for socket."
            );

            return null;
        }

        // If socket already exists and is connected,
        // reuse it.
        if (socket && socket.connected) {
            console.log(
                "Using existing connected socket:",
                socket.id
            );

            return socket;
        }

        // If an old socket exists but is disconnected,
        // completely remove it and create a new one.
        if (socket) {
            console.log(
                "Removing old disconnected socket..."
            );

            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
        }

        console.log(
            "Creating new Socket.IO connection..."
        );

        socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],

            auth: {
                token: token,
            },

            reconnection: true,

            reconnectionAttempts: 10,

            reconnectionDelay: 1000,

            timeout: 10000,
        });


        // =================================================
        // CONNECT
        // =================================================

        socket.on("connect", () => {
            console.log(
                "================================="
            );

            console.log(
                "SOCKET CONNECTED"
            );

            console.log(
                "Socket ID:",
                socket.id
            );

            console.log(
                "================================="
            );
        });


        // =================================================
        // CONNECT ERROR
        // =================================================

        socket.on(
            "connect_error",
            (error) => {

                console.log(
                    "================================="
                );

                console.log(
                    "SOCKET CONNECTION ERROR"
                );

                console.log(
                    "Error:",
                    error.message
                );

                console.log(
                    "Description:",
                    error.description
                );

                console.log(
                    "Context:",
                    error.context
                );

                console.log(
                    "================================="
                );
            }
        );


        // =================================================
        // DISCONNECT
        // =================================================

        socket.on(
            "disconnect",
            (reason) => {

                console.log(
                    "Socket disconnected:",
                    reason
                );
            }
        );


        return socket;

    } catch (error) {

        console.log(
            "Socket initialization error:",
            error.message
        );

        return null;
    }
};


// =====================================================
// GET SOCKET
// =====================================================

export const getSocket = () => {
    return socket;
};


// =====================================================
// DISCONNECT SOCKET
// =====================================================

export const disconnectSocket = () => {

    if (socket) {

        console.log(
            "Disconnecting socket..."
        );

        socket.removeAllListeners();

        socket.disconnect();

        socket = null;
    }
};

