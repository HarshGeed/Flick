import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";
import Review from "@/models/reviewModel";

export const GET = async (req: Request, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    await connect();

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Find the user and populate their liked reviews with user information
    const user = await User.findById(userId).populate({
      path: 'likedReviews',
      model: 'Review',
      populate: {
        path: 'user',
        model: 'User',
        select: 'username profileImage userID'
      },
      options: { sort: { createdAt: -1 } }
    }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.username);
    console.log("User's likedReviews array:", user.likedReviews);
    console.log("Number of liked reviews:", user.likedReviews?.length || 0);

    // Transform the data to include user info at the root level for consistency
    const transformedReviews = (user.likedReviews || []).map(review => ({
      ...review,
      username: review.user?.username || review.username,
      profileImg: review.user?.profileImage || ""
    }));

    console.log("Transformed reviews:", transformedReviews.length);

    // Return the populated liked reviews
    return NextResponse.json(transformedReviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};