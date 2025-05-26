import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Review from "@/models/reviewModel";

export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
  try {
    await connect();

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Find all reviews written by this user
    const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};