import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/lib/dbConn";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { movieId: string } }) {
  try {
    await connect();
    const { movieId } = params;
    if (!movieId) return NextResponse.json({ error: "Movie ID required" }, { status: 400 });

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check if movie is in watchlist
    const inWatchlist = user.watchlist.some(
      (id) => id.toString() === movieId.toString()
    );

    return NextResponse.json({
      success: true,
      inWatchlist,
    });
  } catch (error) {
    console.error("Check watchlist error:", error);
    return NextResponse.json({ error: "Failed to check watchlist" }, { status: 500 });
  }
}
