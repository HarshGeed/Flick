import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviewModel";
import { connect } from "@/lib/dbConn";

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
    const reviews = await Review.find({ movieId })
      .populate("user", "username profileImg")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.log("Fetch review error", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
