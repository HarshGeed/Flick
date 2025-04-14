import { connect } from "@/lib/dbConn";
import { catchAsync } from "@/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/postModel";

export const GET = catchAsync(async () => {
  await connect();

  const posts = await Post.find({}).select("username content image likes comment shares bookmarks reposts").sort({ createdAt: -1 }).exec();
  return NextResponse.json(posts, { status: 200 });
});
