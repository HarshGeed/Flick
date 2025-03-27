// Look right now this code is working fine but we need to create a dialog box instead of a page for creating posts
"use client";

import { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, image }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Post created successfully!");
        setContent("");
        setImage("");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>

      {message && <p className="text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label htmlFor="content" className="font-semibold">
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          className="border p-2 rounded-md w-full"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <label htmlFor="image" className="font-semibold">
          Image URL (optional):
        </label>
        <input
          type="text"
          id="image"
          name="image"
          className="border p-2 rounded-md w-full"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
