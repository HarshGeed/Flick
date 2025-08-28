import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";

export const GET = async (req: Request, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    await connect();

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await User.findById(userId).select("watchlist").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transform the watchlist array of strings into objects with _id and movieId
    const watchlistData = user.watchlist.map((movieId: string, index: number) => ({
      _id: `watchlist_${index}`,
      movieId: movieId
    }));

    return NextResponse.json(watchlistData, { status: 200 });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};