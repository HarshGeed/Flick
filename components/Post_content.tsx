"use client";

import { useEffect, useState } from "react";

export default function PostContent() {
    const [posts, setPosts] = useState([]);

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
    }, []);

    return (
        <main className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Latest Posts</h1>
            <ul className="space-y-4">
                {posts.map((post: { _id: string; username: string; content: string }) => (
                    <li key={post._id} className="p-4 border rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{post.username}</h2>
                        <p className="text-gray-600">{post.content}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
