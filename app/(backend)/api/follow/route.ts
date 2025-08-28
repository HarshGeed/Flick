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

    let followStatus;
    if (isFollowing) {
      // Unfollow logic
      userToFollow.followers = userToFollow.followers.filter(
        (id: any) => id.toString() !== currentUserId
      );
      currentUser.following = currentUser.following.filter(
        (id: any) => id.toString() !== postUserId
      );
      // Decrement counts
      userToFollow.followerCount = Math.max((userToFollow.followerCount || 1) - 1, 0);
      currentUser.followingCount = Math.max((currentUser.followingCount || 1) - 1, 0);
      followStatus = false;
    } else {
      // Follow logic
      userToFollow.followers.push(currentUserId);
      currentUser.following.push(postUserId);
      // Increment counts
      userToFollow.followerCount = (userToFollow.followerCount || 0) + 1;
      currentUser.followingCount = (currentUser.followingCount || 0) + 1;
      followStatus = true;
    }

    await userToFollow.save();
    await currentUser.save();

    // Real-time update via socket.io (optional, only if you want to broadcast)
    try {
      const io = require("../../../../socket-server").io;
      io.to(postUserId).emit("follow_update", {
        userId: postUserId,
        followerCount: userToFollow.followerCount,
        followingCount: userToFollow.followingCount,
        type: "followers"
      });
      io.to(currentUserId).emit("follow_update", {
        userId: currentUserId,
        followerCount: currentUser.followerCount,
        followingCount: currentUser.followingCount,
        type: "following"
      });
    } catch (e) {
      // If socket-server is not available, ignore
    }

    return NextResponse.json(
      {
        message: "Follow status updated successfully",
        isFollowing: followStatus,
        followerCount: userToFollow.followerCount,
        followingCount: currentUser.followingCount,
      },
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
