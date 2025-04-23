import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import { connect } from "@/lib/dbConn";
import socket from "@/lib/socket";

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

    if (post) {
      // It’s a top-level comment on a post
      newCommentData.postId = post._id;
      newCommentData.parentComment = null;

      post.commentCount += 1;
      await post.save();
    } else {
      // It’s a reply to a comment
      const parentComment = await Comment.findById(id);
      if (!parentComment) {
        return NextResponse.json("Parent comment not found", { status: 404 });
      }

      newCommentData.postId = parentComment.postId; // Inherit postId
      newCommentData.parentComment = parentComment._id;

      parentComment.replyCount += 1;
      await parentComment.save();
    }

    const newComment = new Comment(newCommentData);
    await newComment.save();

    return NextResponse.json({
      message: "Comment added successfully",
      commentId: newComment._id,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
