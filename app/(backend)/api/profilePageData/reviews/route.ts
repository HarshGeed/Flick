import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";
import { auth } from "@/auth";

export const GET = async () => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select("reviews").lean();

    return NextResponse.json(user?.reviews || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};