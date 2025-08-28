import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notificationModel";
import { connect } from "@/lib/dbConn";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connect();
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch notifications for the user, most recent first
    const count = await Notification.countDocuments({ recipientId: userId, isRead: false });
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .populate("senderId", "username image")
      .lean();

    // Always return an array for notifications
    return NextResponse.json(
      { notifications: Array.isArray(notifications) ? notifications : [], unread: count > 0 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}