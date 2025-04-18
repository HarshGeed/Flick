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


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // when someone post something
    socket.on("new_post", (data) => {
        io.emit("new_post", data); // broadcast to all users 
    })

    socket.on("like_post", ({postId, liked, likes}) => {
        io.emit("post_liked", {postId, liked, likes});
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

server.listen(4000, () => {
    console.log("Socket.io server running on http://localhost:4000")
})
