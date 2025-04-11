"use client";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";

interface Post {
  _id?: string;
  username: string;
  content: string;
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
      <h1 className="text-3xl font-bold mb-4">Latest Posts</h1>
      <ul className="space-y-4">
        {posts.map(
          (post, index) => (
            <li key={post._id || `post-${index}`} className="p-4 border rounded-lg shadow">
              <h2 className="text-xl font-semibold">{post.username}</h2>
              <p>{post.content}</p>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
