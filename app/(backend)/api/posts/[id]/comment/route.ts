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

    const { id: postId } = await params;
    const userId = session?.user?.id;

    const { text, image, parentComment } = await req.json();

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json("Post not found", { status: 400 });

    const newComment = new Comment({
      postId,
      user: userId,
      text,
      image,
      parentComment: parentComment || null,
    });

    await newComment.save();

    post.commentCount += 1;
    await post.save();

    return NextResponse.json({
      message: "Comment added",
      commentCount: post.commentCount,
    });
  } catch (error) {
    console.error(error);
  }
};
