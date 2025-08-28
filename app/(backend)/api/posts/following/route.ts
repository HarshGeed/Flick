import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUserId = session.user.id;
    const user = await User.findById(currentUserId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const followingIds = user.following || [];
    if (!followingIds.length) {
      return NextResponse.json([], { status: 200 });
    }
    // Fetch posts from users the current user follows
    const posts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching following posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
