import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import Notification from "@/models/notificationModel";
import User from "@/models/userModel";
import { connect } from "@/lib/dbConn";

// Import socket server and onlineUsers map
let io, onlineUsers;
try {
  ({ io, onlineUsers } = require("socket-server"));
} catch (e) {
  io = null;
  onlineUsers = new Map();
}

export const POST = async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { id } = await params; // postId or commentId
    const userId = session.user.id;
    const { text, image } = await req.json();

    // Try to fetch the Post first
    const post = await Post.findById(id);

    let newCommentData = {
      postId: null,
      user: userId,
      text,
      image,
      parentComment: null,
    };

    let recipientId = null;
    let notificationType = "comment";
    let notificationPostId = null;
    let notificationCommentId = null;

    if (post) {
      // Top-level comment on a post
      newCommentData.postId = post._id;
      newCommentData.parentComment = null;

      post.commentCount += 1;
      await post.save();

      // Notify post owner (if not commenting on own post)
      if (post.user.toString() !== userId) {
        recipientId = post.user;
        notificationPostId = post._id;
      }
    } else {
      // Reply to a comment
      const parentComment = await Comment.findById(id);
      if (!parentComment) {
        return NextResponse.json("Parent comment not found", { status: 404 });
      }

      newCommentData.postId = parentComment.postId;
      newCommentData.parentComment = parentComment._id;

      parentComment.replyCount += 1;
      await parentComment.save();

      // Notify parent comment owner (if not replying to own comment)
      if (parentComment.user.toString() !== userId) {
        recipientId = parentComment.user;
        notificationPostId = parentComment.postId;
        notificationCommentId = parentComment._id;
        notificationType = "reply";
      }
    }

    const newComment = new Comment(newCommentData);
    await newComment.save();

    // Create and emit notification if needed
    if (recipientId && recipientId.toString() !== userId) {
      try {
        const notification = await Notification.create({
          recipientId,
          senderId: userId,
          type: notificationType,
          postId: notificationPostId,
          commentId: notificationCommentId,
        });

        // Get sender user info for socket emission
        const senderUser = await User.findById(userId);

        const recipientSocketId = onlineUsers.get(recipientId.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("notification", {
            ...notification.toObject(),
            senderId: {
              _id: senderUser?._id,
              username: senderUser?.username,
              image: senderUser?.profileImage,
            },
          });
        }
      } catch (err) {
        console.error("Error creating notification:", err);
      }
    }

    return NextResponse.json({
      message: "Comment added successfully",
      commentId: newComment._id,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
