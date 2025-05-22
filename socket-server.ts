const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")


const app = express();
const server = http.createServer();

const io = new Server(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST", "PUT"],
    }
})

const onlineUsers = new Map();
 
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
        if(userId){
            onlineUsers.set(userId, socket.id);
        }
    })

    socket.on("send_notification", ({recipientId, notification}) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if(recipientId){
            io.to(recipientSocketId).emit("notification", notification);
        }
    })

    // when someone post something
    socket.on("new_post", (data) => {
        io.emit("new_post", data); // broadcast to all users 
    })

    socket.on("like_post", ({postId, liked, likes}) => {
        io.emit("post_liked", {postId, liked, likes});
    })

    socket.on("new_comment", (data) => {
        io.emit("new_comment", data);
    })
   
    socket.on("new_reply", (data) => {
        io.emit("new_reply", data);
    })

    socket.on("new_review", (review) => {
        io.emit("new_review", review);
    })

    socket.on("like_review", ({reviewId, likesNum}) => {
        io.emit("review_liked", {reviewId, likesNum})
    })

    socket.on("disconnect", () => {
        for(const[userId, sockId] of onlineUsers.entries()){
            if(sockId === socket.id){
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("User disconnected", socket.id)
    })
})

server.listen(4000, () => {
    console.log("Socket.io server running on http://localhost:4000")
})

module.exports = {io, onlineUsers}