import { connect } from "./dbConn";
import User from "@/models/userModel";
import { auth } from "@/auth";

export async function getBookmarks() {
  try {
    connect();

    const session = await auth();
    if (!session || !session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const user = await User.findById(session.user.id).populate({
      path: "savedPosts",
      populate: { path: "user", select: "username profileImg" },
    }).lean();

    if (!user) {
      throw new Error("User not found");
    }
    
    // Serialize the savedPosts data
    const savedPosts = user.savedPosts.map((post) => ({
        ...post,
        _id: post._id.toString(), // Convert _id to a string
        user: post.user
          ? {
              ...post.user,
              _id: post.user._id.toString(), // Convert nested _id to a string
            }
          : null,
      }));
  
      return savedPosts;
  } catch (error) {
    console.error("Error in getBookmarks", error);
    throw error;
  }
}
