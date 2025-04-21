"use client";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Link from "next/link";

interface Post {
  _id?: string;
  username: string;
  content: string;
  shares?: number;
  likes?: number;
  bookmarks?: number;
  reposts?: number;
  profileImg?: string;
  image?: string[];
  likedInitially: boolean;
  commentCount: number;
}

export default function PostContent() {
  const [posts, setPosts] = useState<Post[]>([]);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/fetchPosts", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data : Post[] = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    
    fetchPosts();

    // listen to real-time post updates
    socket.on("new_post", (newPost: Post) => {
      try {
        fetchPosts();
      } catch (error){
        console.error("Error handling new post:", error);
      }
    });

    // cleanup the socket listener on unmount
    return () => {
      socket.off("new_post");
    };
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <ul className="space-y-4">
        {posts.map(
          (post, index) => (
            <li key={post._id || `post-${index}`}>
              <Link href={`/dashboard/${post._id}/`}>
              <PostCard username={post.username} content={post.content} shares={post.shares || 0} likes={post.likes || 0} bookmarks={post.bookmarks || 0} reposts={post.reposts || 0} profileImg={post.profileImg} postImg={post.image} postId={post._id} likedInitially={post.likedInitially} commentCount={post.commentCount}/>
              </Link>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
