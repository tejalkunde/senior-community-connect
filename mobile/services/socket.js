import { io } from "socket.io-client";

const SOCKET_URL = "http://10.1.26.110:5000";

let socket;

export const connectSocket = (userId) => {

    socket = io(SOCKET_URL, {
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);

        socket.emit("user_online", {
            userId,
        });
    });

    return socket;
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