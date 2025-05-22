import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviewModel";


export async function POST(req: NextRequest, { params }: { params: { reviewId: string } }) {
  try {
    const { reviewId } = params;
    if (!reviewId) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    review.likesNum = (review.likesNum || 0) + 1;
    await review.save();

    return NextResponse.json({ success: true, likesNum: review.likesNum });
  } catch (error) {
    return NextResponse.json({ error: "Failed to like review" }, { status: 500 });
  }
}