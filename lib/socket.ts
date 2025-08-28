import {io} from "socket.io-client"

// Use environment variable for socket server URL
// In development: http://localhost:4000
// In production: your Render app URL
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

const socket = io(socketUrl);

export default socket;