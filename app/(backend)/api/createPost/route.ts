import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel";
import { auth } from "@/auth";
import User from "@/models/userModel";

export const runtime = "nodejs";

interface PostRequestBody {
  content: string;
  image?: string;
}

export const POST = async (req: NextRequest) => {
    try{
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  await connect();

  const session = await auth();
  console.log(session?.user.name);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: PostRequestBody = await req.json();
  const { content, image } = body;
  if (!content?.trim() && (!image || image.length === 0))
    return NextResponse.json(
      { message: "Post content cannot be empty" },
      { status: 400 }
    );

  // Ensuring image is a flat array
  if (!Array.isArray(image)) {
    return NextResponse.json(
      { error: "Invalid image format. Expected an array of strings" },
      { status: 400 }
    );
  }

  //Validate each image url
  const isValidImageArray = image.every((url) => typeof url === "string");
  if (!isValidImageArray) {
    return NextResponse.json(
      { error: "Invalid image format. All items must be strings." },
      { status: 400 }
    );
  }

  const newPost = new Post({
    user: session.user.id,
    username: session.user.name,
    content : content?.trim() || null,
    image: image || [],
  });

  await newPost.save();

  await User.findByIdAndUpdate(session.user.id, {
    $push: {userCreatedPosts: newPost._id}
  },
  {new: true}
);
  return NextResponse.json(
    { message: "Post created successfully", post: newPost },
    { status: 201 }
  );
}catch(error){
    console.log("This is the 🔥", error);
}
};
