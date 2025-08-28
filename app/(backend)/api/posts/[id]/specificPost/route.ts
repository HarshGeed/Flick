import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    await connect();

    // 1. Try finding the Post
    const post = await Post.findById(id)
      .populate("user", "username profileImg")
      .lean();

    if (post) {
      // Fetch all comments related to this post
      const allComments = await Comment.find({ postId: id })
        .populate("user", "username profileImg")
        .lean();

      // Create a map for fast lookup
      const commentMap = new Map<string, any>();
      allComments.forEach((comment) => {
        comment.replies = []; // Initialize replies
        commentMap.set(comment._id.toString(), comment);
      });

      // Organize comments into nested structure
      const topLevelComments: any[] = [];

      allComments.forEach((comment) => {
        if (comment.parentCommentId) {
          const parentComment = commentMap.get(comment.parentCommentId.toString());
          if (parentComment) {
            parentComment.replies.push(comment);
          }
        } else {
          topLevelComments.push(comment);
        }
      });

      return NextResponse.json(
        { post, comments: topLevelComments },
        { status: 200 }
      );
    }

    // 2. If not a post, maybe it’s a Comment
    const comment = await Comment.findById(id)
      .populate("user", "username profileImg")
      .populate({
        path: "replies",
        populate: { path: "user", select: "username profileImg" },
      })
      .lean();

    if (comment) {
      return NextResponse.json(
        { comment, replies: comment.replies || [] },
        { status: 200 }
      );
    }

    // 3. Nothing found
    return NextResponse.json(
      { error: "Post or Comment not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching post/comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
