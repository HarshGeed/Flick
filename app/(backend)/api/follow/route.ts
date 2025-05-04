import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";

export const POST = async (req: NextRequest) => {
  try {
    connect();

    const { postUserId, currentUserId } = await req.json();
    console.log("User ID", postUserId);
    console.log("current user id", currentUserId);
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

    // Check if already following
    const isFollowing = userToFollow.followers.includes(currentUserId);

    if (userToFollow !== currentUser) {
      if (isFollowing) {
        // Unfollow logic
        userToFollow.followers = userToFollow.followers.filter(
          (id) => id.toString() !== currentUserId
        );
        currentUser.following = currentUser.following.filter(
          (id) => id.toString() !== postUserId
        );
      } else {
        // Follow logic
        userToFollow.followers.push(currentUserId);
        currentUser.following.push(postUserId);
      }
    }
    // Save changes
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
