import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviewModel";
import User from "@/models/userModel";
import { connect } from "@/lib/dbConn";
import { auth } from "@/auth";


export async function POST(req: NextRequest, { params }: { params: { reviewId: string } }) {
  try {
    await connect();
    const { reviewId } = params;
    if (!reviewId) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    // Ensure likedBy is always an array
    review.likedBy = review.likedBy || [];

    const hasLiked = review.likedBy.some((id) => id.toString() === userId.toString());

    // Get the user to update their likedReviews array
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Ensure user.likedReviews is always an array
    user.likedReviews = user.likedReviews || [];

    if (hasLiked) {
      // Unlike: Remove from both review.likedBy and user.likedReviews
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userId.toString());
      review.likesNum = Math.max((review.likesNum || 1) - 1, 0);
      
      // Remove from user's likedReviews array
      user.likedReviews = user.likedReviews.filter((id) => id.toString() !== reviewId.toString());
    } else {
      // Like: Add to both review.likedBy and user.likedReviews
      review.likedBy.push(userId);
      review.likesNum = (review.likesNum || 0) + 1;
      
      // Add to user's likedReviews array if not already present
      if (!user.likedReviews.some((id) => id.toString() === reviewId.toString())) {
        user.likedReviews.push(reviewId);
      }
    }

    // Save both models
    await Promise.all([review.save(), user.save()]);

    return NextResponse.json({
      success: true,
      reviewId: review._id.toString(),
      likesNum: review.likesNum,
      liked: !hasLiked,
      likedBy: review.likedBy.map((id) => id.toString()), // for frontend state update
    });
    
  } catch (error) {
    console.log("Review like error", error);
    return NextResponse.json({ error: "Failed to like review" }, { status: 500 });
  }
}