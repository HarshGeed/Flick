import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import Notification from "@/models/notificationModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Socket server import (adjust path if needed)
let io, onlineUsers;
try {
  ({ io, onlineUsers } = require("socket-server"));
} catch (e) {
  io = null;
  onlineUsers = new Map();
}

export const PUT = async (req, { params }) => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // Post ID
    const userId = session.user.id;

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    post.savedBy = post.savedBy || [];
    user.savedPosts = user.savedPosts || [];
    // Check if the post is already saved by the user
    const alreadySaved = post.savedBy.includes(userId);

    if (alreadySaved) {
      // Unsave the post
      post.savedBy.pull(userId);
      user.savedPosts.pull(id);
      post.saveCounts = Math.max((post.saveCounts || 0) - 1, 0);
    } else {
      // Save the post
      post.savedBy.push(userId);
      user.savedPosts.push(id);
      post.saveCounts = (post.saveCounts || 0) + 1;

      // Create notification if the post owner is not the one saving
      if (post.user.toString() !== userId) {
        try {
          const notification = await Notification.create({
            recipientId: post.user,
            senderId: userId,
            type: "save",
            postId: post._id,
          });
          // Log for debugging
          console.log("Notification created:", notification);

          if (io && onlineUsers) {
            const recipientSocketId = onlineUsers.get(post.user.toString());
            if (recipientSocketId) {
              io.to(recipientSocketId).emit("notification", {
                ...notification.toObject(),
                senderId: {
                  _id: user._id,
                  username: user.username,
                  image: user.profileImage,
                },
              });
            }
          }
        } catch (err) {
          console.error("Error creating notification:", err);
        }
      }
    }

    // Save the changes
    await post.save();
    await user.save();

    return NextResponse.json(
      {
        message: alreadySaved ? "Post unsaved successfully" : "Post saved successfully",
        saved: !alreadySaved,
        saveCounts: post.saveCounts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};