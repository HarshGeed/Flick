import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviewModel";
import { connect } from "@/lib/dbConn";
import { auth } from "@/auth";


export async function POST(req: NextRequest, { params }: { params: { reviewId: string } }) {
  try {
    connect();
    const { reviewId } = await params;
    if (!reviewId) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    const session = await auth();
    if(!session?.user?.id) return NextResponse.json({error: "Review ID required"}, {status: 401})
    const userId = session.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    const hasLiked = review.likedBy?.some((id) => id.toString() === userId)

    if(hasLiked){
      //unlike
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userId);
      review.likesNum = Math.max((review.likesNum || 1) -1, 0);
    }else{
      //like
      review.likedBy = [...(review.likedBy || []), userId];
      review.likesNum = (review.likesNum || 0) + 1;
    }

    await review.save();

    return NextResponse.json({
      success: true,
      reviewId: review._id.toString(),
      likesNum: review.likesNum,
      liked: !hasLiked,
    });
    
  } catch (error) {
    console.log("Review like error", error);
    return NextResponse.json({ error: "Failed to like review" }, { status: 500 });
  }
}