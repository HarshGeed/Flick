import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Review from "@/models/reviewModel";
import User from "@/models/userModel";

export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
  try {
    await connect();

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Find all reviews written by this user and populate user data
    const reviews = await Review.find({ user: userId })
      .populate({
        path: 'user',
        model: 'User',
        select: 'username profileImage userID'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform the data to include user info at the root level for consistency
    const transformedReviews = reviews.map(review => ({
      ...review,
      username: review.user?.username || review.username,
      profileImg: review.user?.profileImage || ""
    }));

    return NextResponse.json(transformedReviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};