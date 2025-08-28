import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/lib/dbConn";
import { auth } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ movieId: string }> }) {
  try {
    await connect();
    const { movieId } = await params;
    if (!movieId) return NextResponse.json({ error: "Movie ID required" }, { status: 400 });

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Compute if movie is in watchlist BEFORE toggle
    const wasInWatchlist = user.watchlist.some(
      (id) => id.toString() === movieId.toString()
    );

    // Toggle movie in watchlist
    if (wasInWatchlist) {
      // Remove from watchlist
      user.watchlist = user.watchlist.filter(
        (id) => id.toString() !== movieId.toString()
      );
    } else {
      // Add to watchlist
      user.watchlist.push(movieId);
    }

    await user.save();

    // Compute if movie is in watchlist AFTER toggle
    const inWatchlist = user.watchlist.some(
      (id) => id.toString() === movieId.toString()
    );

    return NextResponse.json({
      success: true,
      inWatchlist, // this is the new state after toggle
      wasInWatchlist, // this is the state before toggle (optional)
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Watchlist error:", error);
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
  }
}