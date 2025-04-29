'use client';

import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";

const btnClass =
  "cursor-pointer px-4 py-2 rounded-xl opacity-60 hover:bg-stone-900 transition ease-in-out duration-200";

export default function ProfilePage() {
  const [activeSession, setActiveSection] = useState("Posts");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/profilePageData/${activeSession.toLowerCase()}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSession]);

  const renderMainContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (data.length === 0) return <p>No data available.</p>;

    return (
      <div className="space-y-4">
        {data.map((post) => (
          <PostCard
            key={post._id}
            postId={post._id}
            username={post.username}
            content={post.content}
            likes={post.likes || 0}
            commentCount={post.commentCount || 0}
            shares={post.shares || 0}
            profileImg={post.profileImg}
            postImg={post.image || []}
            likedInitially={post.likedBy?.includes(post.userId)}
            initialBookmarkCount={post.saveCounts || 0}
            initiallySaved={post.savedBy?.includes(post.userId)}
            navigateTo={`/dashboard/posts/${post._id}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-[36.5rem] relative">
      {/* Top Profile Section */}
      <div className="flex flex-col flex-shrink-0">
        {/* Cover Image */}
        <div className="w-full h-[12rem] bg-white rounded-t-2xl relative overflow-hidden">
          {/* Cover image will come here */}
        </div>

        {/* Profile Image */}
        <div className="w-[8rem] h-[8rem] rounded-full bg-amber-900 absolute top-[8rem] left-6 z-20">
          {/* Profile image */}
        </div>

        {/* Profile Details */}
        <div className="mt-[5rem] ml-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">Harsh Geed 🚀</p>
            <button className="bg-stone-900 rounded-2xl px-4 py-1 font-light opacity-80 transition ease-in-out duration-300 cursor-pointer shadow-2xl hover:bg-stone-800">
              <p>Edit Profile</p>
            </button>
          </div>
          <p className="text-sm opacity-60 font-medium">@GeedHarsh</p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis,
            iure voluptatibus possimus doloremque nesciunt molestiae adipisci,
            necessitatibus similique natus minima ex maxime pariatur quaerat dolorum,
            laboriosam blanditiis! Dolor laudantium ab omnis odit, eum nisi culpa
            sequi accusamus, laborum cupiditate tenetur explicabo? Repudiandae aliquid
            cum deserunt dolorem accusantium cumque rem nesciunt.
          </p>

          {/* Followers and Following */}
          <div className="flex space-x-5 mt-4">
            <div className="flex space-x-1">
              <p>43</p>
              <p className="opacity-50 font-light">Followers</p>
            </div>
            <div className="flex space-x-1">
              <p>78</p>
              <p className="opacity-50">Following</p>
            </div>
          </div>
        </div>

        {/* Session Buttons */}
        <div className="sticky top-0 z-50 mt-8 shadow-md">
         
          <div className="flex justify-center space-x-4">
            <button onClick={() => setActiveSection("Posts")} className={btnClass}>Posts</button>
            <button onClick={() => setActiveSection("Reviews")} className={btnClass}>Reviews</button>
            <button onClick={() => setActiveSection("LikedPosts")} className={btnClass}>Liked Posts</button>
            <button onClick={() => setActiveSection("LikedReviews")} className={btnClass}>Liked Reviews</button>
            <button onClick={() => setActiveSection("Watchlist")} className={btnClass}>Watchlist</button>
          </div>
          
        </div>
      </div>

      {/* Posts Section */}
      <div className="flex-1 mt-6 px-4">
        <div className="pb-[2rem]">

        {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
