import { connect } from "@/lib/dbConn"
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Post from "@/models/postModel";


export const POST = async(req, {params}) => {
    try{
        await connect();
        const session = await auth();

        if (!session || !session.user?.id) {
              return NextResponse.json("Unauthorized", { status: 401 });
            }

        const {id: postId} = await params;
        const userId = session?.user?.id;

        const {text, image} = await req.json();

        const post = await Post.findById(postId);
        if(!post) return NextResponse.json("Post not found", {status: 400});

        post.comments.push({user: userId, text, image});
        post.comment += 1;
        await post.save();

        return NextResponse.json({message: "Comment added"})
    }catch(error){
        console.error("Comment POST error", error);
    }
}