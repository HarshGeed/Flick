import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import User from "@/models/userModel";
import { auth } from "@/auth";
import { connect } from "@/lib/dbConn";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Notification from "@/models/notificationModel";

const { io, onlineUsers } = require("../../../../../socket-server");

export const PUT = async (req, { params }) => {
  try {
    await connect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { id } = params; // `id` can be a postId or commentId
    const userId = session?.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json("Invalid ID", { status: 400 });
    }

    // Check if the ID belongs to a Post
    let post = await Post.findById(id);
    let comment = null;

    if (!post) {
      // If not a post, check if it's a comment
      comment = await Comment.findById(id);
      if (!comment) {
        return NextResponse.json("Not found", { status: 404 });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const alreadyLiked = post
      ? post.likedBy.includes(userId)
      : comment.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike
      user.likedPosts.pull(id);
      if (post) {
        post.likedBy.pull(userId);
        post.likes = Math.max((post.likes || 0) - 1, 0);
      } else {
        comment.likedBy.pull(userId);
        comment.likes = Math.max((comment.likes || 0) - 1, 0);
      }
    } else {
      // Like
      user.likedPosts.push(id);
      if (post) {
        post.likedBy.push(userId);
        post.likes = (post.likes || 0) + 1;

        if (post.user.toString() !== userId) {
          const notification = await Notification.create({
            recipientId: post.user,
            senderId: userId,
            type: "like",
            postId: post._id,
          });

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
      } else {
        comment.likedBy.push(userId);
        comment.likes = (comment.likes || 0) + 1;

        if (comment.user.toString() !== userId) {
          const notification = await Notification.create({
            recipientId: comment.user,
            senderId: userId,
            type: "like",
            commentId: comment._id,
            postId: comment.post,
          });

          const recipientSocketId = onlineUsers.get(comment.user.toString());
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
      }
    }

    await user.save();
    if (post) {
      await post.save();
    } else {
      await comment.save();
    }

    return NextResponse.json(
      {
        liked: !alreadyLiked,
        likes: post ? post.likes : comment.likes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
