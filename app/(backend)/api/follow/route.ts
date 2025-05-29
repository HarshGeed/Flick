import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";

// Follow/Unfollow logic
export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const { postUserId, currentUserId } = await req.json();
    if (!postUserId || !currentUserId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Find the user to follow
    const userToFollow = await User.findById(postUserId);
    if (!userToFollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    // Prevent self-follow
    if (postUserId === currentUserId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const isFollowing = userToFollow.followers
      .map((id: any) => id.toString())
      .includes(currentUserId);

    if (isFollowing) {
      // Unfollow logic
      userToFollow.followers = userToFollow.followers.filter(
        (id: any) => id.toString() !== currentUserId
      );
      currentUser.following = currentUser.following.filter(
        (id: any) => id.toString() !== postUserId
      );
    } else {
      // Follow logic
      userToFollow.followers.push(currentUserId);
      currentUser.following.push(postUserId);
    }

    await userToFollow.save();
    await currentUser.save();

    return NextResponse.json(
      { message: "Follow status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating follow status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Check follow status
export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const profileUserId = searchParams.get("profileUserId");
    const currentUserId = searchParams.get("currentUserId");

    if (!profileUserId || !currentUserId) {
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    }

    const profileUser = await User.findById(profileUserId)
      .select("followers")
      .lean();
    if (!profileUser) {
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    }

    const isFollowing = (profileUser.followers || []).some(
      (id: any) => id.toString() === currentUserId
    );

    return NextResponse.json({ isFollowing }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isFollowing: false }, { status: 200 });
  }
}
