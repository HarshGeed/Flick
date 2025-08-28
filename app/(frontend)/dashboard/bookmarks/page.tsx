"use client";
import { BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";

export default function Bookmarks() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/fetchBookmarks/`
        );

        if (!res.ok) {
          if (res.status === 401) {
            setError("Unauthorized. Please log in.");
            return;
          }
          setError("Failed to fetch bookmarks.");
          return;
        }

        const { savedPosts } = await res.json();
        setSavedPosts(savedPosts || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <div className="flex items-center absolute space-x-2 p-2 rounded-xl shadow-xl bg-gray-900 w-[11rem]">
          <BookmarkCheck strokeWidth={2.75} size={32} />
          <h2 className="text-xl font-bold">Bookmarks</h2>
        </div>
        <div className="h-screen w-[36.5rem] mt-[4rem]">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                {/* Header Skeleton */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-5 bg-gray-700/50 rounded w-32 animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content Skeleton */}
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
                </div>
                
                {/* Image Skeleton */}
                <div className="h-48 bg-gray-700/50 rounded-lg animate-pulse mb-4"></div>
                
                {/* Actions Skeleton */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-8 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-8 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-8 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  if (savedPosts.length === 0) {
    return <p className="text-center text-gray-500 text-lg">No bookmarks found.</p>;
  }

  return (
    <div className="flex">
      <div className="flex items-center absolute space-x-2 p-2 rounded-xl shadow-xl bg-gray-900 w-[11rem]">
        <BookmarkCheck strokeWidth={2.75} size={32} />
        {/* you may change the font style here  */}
        <h2 className="text-xl font-bold">Bookmarks</h2>
      </div>
      <div className="h-screen w-[36.5rem] mt-[4rem]">
    <div className="space-y-4">

      {savedPosts.map((post) => (
        <PostCard
          key={post._id}
          postId={post._id}
          username={post.user?.username || "Anonymous"}
          content={post.content}
          likes={post.likes || 0}
          commentCount={post.comments?.length || 0}
          shares={post.shares || 0}
          profileImg={post.user?.profileImg || null}
          postImg={Array.isArray(post.images) ? post.images : []}
          likedInitially={post.likedBy?.includes(post.userId)}
          initialBookmarkCount={post.saveCounts || 0}
          initiallySaved={true}
          navigateTo={`/dashboard/${post._id}`}
        />
      ))}
    </div>
    </div>
    </div>
  );
}
