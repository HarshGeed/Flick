import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    connect();

    const post = await Post.findById(id).lean();
    if(post){
      const comments = await Comment.find({postId: id}).populate("user", "name").lean();

      return NextResponse.json({post, comments}, {status: 200})
    }

    // if not post then here we will check for comment
    const comment = await Comment.findById(id).populate("user", "name").populate({
      path: "replies",
      populate: {path: "user", select: "name"}
    }).lean();


    if(comment){
      return NextResponse.json({comment, replies: comment.replies}, {status: 200})
    }

    return NextResponse.json({error: "Post or comment not found"}, {status: 400})
  } catch (error) {
    console.error("Error fetching the post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
