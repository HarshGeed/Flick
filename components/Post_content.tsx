"use client";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

interface Post {
  _id?: string;
  username: string;
  content: string;
  shares?: number;
  likes?: number;
  comment?: number;
  bookmarks?: number;
  reposts?: number;
  profileImg?: string;
  postImg?: string[];
}

export default function PostContent() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/fetchPosts", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();

    // listen to real-time post updates
    socket.on("new_post", (newPost: Post) => {
      try {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
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
              <PostCard username={post.username} content={post.content} shares={post.shares || 0} likes={post.likes || 0} comment={post.comment || 0} bookmarks={post.bookmarks || 0} reposts={post.reposts || 0} profileImg={post.profileImg} postImg={post.postImg}/>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
