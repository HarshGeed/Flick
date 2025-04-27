import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params; // Post ID
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
      post.saveCounts = Math.max((post.saveCounts || 0) -1, 0)
    } else {
      // Save the post
      post.savedBy.push(userId);
      user.savedPosts.push(id);
      post.saveCounts = (post.saveCounts || 0) + 1;
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