import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import { auth } from "@/auth";

export const GET = async () => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await Post.find({ likedBy: session.user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};