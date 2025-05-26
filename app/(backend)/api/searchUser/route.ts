import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/lib/dbConn";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json([], { status: 200 });
    }

    // Search by username or userID (case-insensitive, partial match)
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { userID: { $regex: q, $options: "i" } },
      ],
    })
      .limit(10)
      .select("_id username userID profileImage");

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}