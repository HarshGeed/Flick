import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notificationModel";
import { connect } from "@/lib/dbConn";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}