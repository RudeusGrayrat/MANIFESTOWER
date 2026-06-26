import { io } from "socket.io-client";

const urlServer = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const socket = io(urlServer, {
    withCredentials: true,
    transports: ["websocket", "polling"],  // recomendado para mayor estabilidad
    autoConnect: false,
});

export default socket;