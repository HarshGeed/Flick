import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();

    const session = await auth();
    console.log(session)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session?.user?.id).populate({
      path: "savedPosts",
      populate: { path: "user", select: "username profileImg" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ savedPosts: user.savedPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};