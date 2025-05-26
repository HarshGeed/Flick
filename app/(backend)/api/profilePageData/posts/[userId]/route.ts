import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";


export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
  try {
    await connect();

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await User.findById(userId)
      .populate({
        path: "userCreatedPosts",
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.userCreatedPosts || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};