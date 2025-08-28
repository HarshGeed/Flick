import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";

export const GET = async (req: Request, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    await connect();

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const posts = await Post.find({ likedBy: userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};