import { io } from "socket.io-client";

const socket = io("https://model-forge.onrender.com");
export default socket;
