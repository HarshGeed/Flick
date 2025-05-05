'use client';
import EditProfileModal from "@/components/EditProfileModal";
import PostCard from "@/components/PostCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultProfileImg from '@/public/default-userImg.png'

const btnClass =
  "cursor-pointer px-4 py-2 rounded-xl opacity-60 hover:bg-stone-900 transition ease-in-out duration-200";

export default function ProfilePage() {
  const [activeSession, setActiveSection] = useState("Posts");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchUserData = async() => {
      try{
        const res = await fetch("/api/profilePageData/profileData");
        if(!res.ok) throw new Error("Failed to fetch the user data");
        const userData = await res.json();
        setUser(userData);
      }catch(err){
        console.error("Error fetching user data:", err);
      }
    }

    fetchUserData();
  }, []);

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

  if(!user){
    return <p>Loading the user data...</p>
  }

  return (
    <div className="flex flex-col h-screen w-[36.5rem] relative">
      {/* Top Profile Section */}
      <div className="flex flex-col flex-shrink-0">
        {/* Cover Image */}
        <div className="w-full h-[12rem] rounded-t-2xl relative overflow-hidden">
          {user.coverImage ? (
            <Image
            src={user.coverImage}
            alt="Cover Image"
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
            />
          ): (
              <div className="w-full h-full bg-gray-800"></div>
          )}
        </div>

        {/* Profile Image */}
        <div className="w-[8rem] h-[8rem] rounded-full bg-amber-900 absolute top-[8rem] left-6 z-20 overflow-hidden">
        
            <Image
            src={user.profileImage || defaultProfileImg}
            alt="Profile Image"
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
            />
          
        </div>

        {/* Profile Details */}
        <div className="mt-[5rem] ml-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">{user.username}</p>
            <button className="bg-stone-900 rounded-2xl px-4 py-1 font-light opacity-80 transition ease-in-out duration-300 cursor-pointer shadow-2xl hover:bg-stone-800"
            onClick={() => setIsModalOpen(true)}
            >
              <p>Edit Profile</p>
            </button>
          </div>
          <p className="text-sm opacity-60 font-medium">{user.userID}</p>
          <p className="mt-4">
            {user.bio}
          </p>

          {/* Followers and Following */}
          <div className="flex space-x-5 mt-4">
            <div className="flex space-x-1">
              <p>{user.followerCount || 0}</p>
              <p className="opacity-50 font-light">Followers</p>
            </div>
            <div className="flex space-x-1">
              <p>{user.followingCount || 0}</p>
              <p className="opacity-50">Following</p>
            </div>
          </div>
        </div>

        {/* Session Buttons */}
        {/* Right now sticky is not working but make it work later */}
        <div className="sticky top-0 z-50 mt-8 shadow-md">
         
          <div className="flex justify-center space-x-4">
            <button onClick={() => setActiveSection("Posts")} className={`${btnClass} ${activeSession === "Posts" ? "bg-stone-900" : ""}`}>Posts</button>
            <button onClick={() => setActiveSection("Reviews")} className={`${btnClass} ${activeSession === "Reviews" ? "bg-stone-900" : ""}`}>Reviews</button>
            <button onClick={() => setActiveSection("LikedPosts")} className={`${btnClass} ${activeSession === "LikedPosts" ? "bg-stone-900" : ""}`}>Liked Posts</button>
            <button onClick={() => setActiveSection("LikedReviews")} className={`${btnClass} ${activeSession === "LikedReviews" ? "bg-stone-900" : ""}`}>Liked Reviews</button>
            <button onClick={() => setActiveSection("Watchlist")} className={`${btnClass} ${activeSession === "Watchlist" ? "bg-stone-900" : ""}`}>Watchlist</button>
          </div>
          
        </div>
      </div>

      {/* Posts Section */}
      <div className="flex-1 mt-6 px-4">
        <div className="pb-[2rem]">

        {renderMainContent()}
        </div>
      </div>

      <EditProfileModal openState={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </div>
  );
}
