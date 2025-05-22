import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Review from "@/models/reviewModel";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { movieId, review } = body;

    if (!movieId || !review) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use session.user.id and session.user.name from the session
    const newReview = await Review.create({
      movieId,
      user: session.user.id,
      username: session.user.name,
      review,
    });

    return NextResponse.json({ message: "Review created", review: newReview }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}