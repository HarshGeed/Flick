import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviewModel";
import { connect } from "@/lib/dbConn";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { movieId: string } }
) {
  try {
    connect();
    const { movieId } = await params;
    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const reviews = await Review.find({ movieId })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    const reviewsWithLiked = reviews.map((review) => {
      const liked =
        userId &&
        review.likedBy?.some((id) => id.toString() === userId.toString());
      return {
        ...review.toObject(),
        liked,
      };
    });

    return NextResponse.json(reviewsWithLiked, { status: 200 });
  } catch (error) {
    console.log("Fetch review error", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
