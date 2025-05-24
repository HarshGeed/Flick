import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviewModel";
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

    if (hasLiked) {
      // Unlike
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userId.toString());
      review.likesNum = Math.max((review.likesNum || 1) - 1, 0);
    } else {
      // Like
      review.likedBy.push(userId);
      review.likesNum = (review.likesNum || 0) + 1;
    }

    await review.save();

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