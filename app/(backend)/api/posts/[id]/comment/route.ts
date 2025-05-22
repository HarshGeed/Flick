import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import Notification from "@/models/notificationModel";
import { connect } from "@/lib/dbConn";

// Import socket server and onlineUsers map
const { io, onlineUsers } = require("../../../../../socket-server");

export const POST = async (req, { params }) => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { id } = params; // postId or commentId
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
      }
    }

    const newComment = new Comment(newCommentData);
    await newComment.save();

    // Create and emit notification if needed
    if (recipientId && recipientId.toString() !== userId) {
      const notification = await Notification.create({
        recipientId,
        senderId: userId,
        type: notificationType,
        postId: notificationPostId,
        commentId: notificationCommentId,
      });

      const recipientSocketId = onlineUsers.get(recipientId.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", {
          ...notification.toObject(),
          senderId: {
            _id: session.user.id,
            username: session.user.name,
            image: session.user.image,
          },
        });
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
