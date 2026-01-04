import { io } from "socket.io-client";
import { getSocketUrl } from "./socketConfig";

const socket = io(getSocketUrl(), {
    transports: ["websocket"],
});

export default socket;
