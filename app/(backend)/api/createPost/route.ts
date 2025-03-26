import { catchAsync } from "@/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import Post from "@/models/postModel"
import { auth } from "@/auth";

interface PostRequestBody{
    content: string;
    image?: string;
}

export const POST = catchAsync(async (req: NextRequest) => {
    if(req.method !== "POST"){
        return NextResponse.json({message: "Method not allowed"}, {status: 405});
    }

    await connect();

    const session = await auth();
    console.log(session?.user.name);
    if(!session) return NextResponse.json({message: "Unauthorized"}, {status: 401});

    const body: PostRequestBody = await req.json();
    const{content, image} = body;
    if(!content) return NextResponse.json({message: "Post content is required"}, {status: 400});

    const newPost = new Post({
        user: session.user.id,
        content,
        image: image || null
    })

    await newPost.save();
    NextResponse.json({message: "Post created successfully", post: newPost}, {status: 201})
    
})