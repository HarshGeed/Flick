import Post from "@/models/postModel";
import User from "@/models/userModel";
import { auth } from "@/auth";
import { connect } from "@/lib/dbConn";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const PUT = async (req, { params }) => {
  try {
    await connect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { id: postId } = await params;
    const userId = session?.user?.id;

    if(!mongoose.Types.ObjectId.isValid(postId)){
      return NextResponse.json("Invalid postId", {status: 400})
    }

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) return NextResponse.json("Not found", { status: 404 });

    const alreadyLiked = user.likedPosts.includes(postId);

    if (alreadyLiked) {
      // unlike
      user.likedPosts.pull(postId);
      post.likedBy.pull(userId);
      post.likes = Math.max((post.likes || 0) - 1, 0);
    } else {
      //like
      user.likedPosts.push(postId);
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
    }

    await user.save();
    await post.save();

    return NextResponse.json({ liked: !alreadyLiked, likes: post.likes}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({message: "Internal server error", error: error.message}, {status: 500})
  }
};
