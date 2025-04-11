const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")

const app = express();
const server = http.createServer();

const io = new Server(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"],
    }
})

let posts = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // send all post when user joins
    socket.emit("load_posts", posts);

    // when someone post something
    socket.on("new_post", (data) => {
        posts.unshift(data); // store in memory
        io.emit("new_post", data); // broadcast to all users
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

server.listen(4000, () => {
    console.log("Socket.io server running on http://localhost:4000")
})
