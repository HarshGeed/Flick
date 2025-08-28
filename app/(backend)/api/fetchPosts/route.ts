import { connect } from "@/lib/dbConn";
import { catchAsync } from "@/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/postModel";
import { auth } from "@/auth";

export const GET = catchAsync(async () => {
  await connect();

  const session = await auth();
  const userId = session?.user?.id;

  const posts = await (Post as any).find({})
    .populate("user", "_id username profileImg")
    .select("user username content image likes shares bookmarks reposts likedBy commentCount savedBy saveCounts")
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const enhancedPosts = posts.map((post) => ({
    ...post,
    likedInitially: userId ? post.likedBy?.map((id) => id.toString()).includes(userId) : false
  }))
  return NextResponse.json(enhancedPosts, { status: 200 });
});
