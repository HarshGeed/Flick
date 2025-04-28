"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookmarkBtn({
  postId,
  initiallySaved,
  initialBookmarkCount,
}) {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount || 0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSavePost = async () => {
    if (loading) return; // Prevent multiple clicks while loading
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/savePost`, {
        method: "PUT",
      });

      if (!res.ok) {
        console.error("Failed to save post");
        return;
      }

      const data = await res.json();
      setIsSaved(data.saved); // Update save status
      setBookmarkCount(data.saveCounts); // Update bookmark count
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSavePost}
      disabled={loading}
      aria-label={isSaved ? "Unsave post" : "Save post"}
      className="flex gap-1 items-center cursor-pointer group hover:text-gray-700 transition-all duration-300"
    >
      {isSaved ? (
        <BookmarkCheck className="text-gray-400 group-hover:text-gray-700" size={24} />
      ) : (
        <Bookmark className="text-gray-400 group-hover:text-gray-700" size={24} />
      )}
      <span className="text-sm text-gray-300 group-hover:text-gray-700">{bookmarkCount}</span>
    </button>
  );
}
