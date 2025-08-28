'use client';
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import ReviewCard from "@/components/ReviewCard";
import Image from "next/image";
import defaultProfileImg from '@/public/default-userImg.png';
import FollowBtn from "@/components/FollowBtn";
import { useParams } from "next/navigation";

const btnClass =
  "cursor-pointer px-4 py-2 rounded-xl opacity-60 hover:bg-stone-900 transition ease-in-out duration-200";

export default function ProfilePageOther() {
  const [activeSession, setActiveSection] = useState("Posts");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  

  const params = useParams();
  const userId = params.userId;
  console.log("This is the userId at profilePageOthers", userId);

  // Get current user's session for like functionality
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setCurrentUserId(data.userId))
      .catch(() => setCurrentUserId(null));
  }, []);

  useEffect(() => {
    if(!userId) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/profilePageData/profileData/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch the user data");
        const userData = await res.json();
        setUser(userData);
        setFollowerCount(userData.followerCount ?? 0);
        setFollowingCount(userData.followingCount ?? 0);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if(!userId) return;
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Map the active session to the correct API endpoint
        const sessionToEndpoint = {
          "Posts": "posts",
          "Reviews": "reviews", 
          "LikedPosts": "likedposts",
          "LikedReviews": "likedreviews"
        };
        
        const endpointName = sessionToEndpoint[activeSession] || activeSession.toLowerCase();
        const endpoint = `/api/profilePageData/${endpointName}/${userId}`;
        console.log("Fetching data from:", endpoint);
        
        const res = await fetch(endpoint);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", res.status, errorText);
          throw new Error(`Failed to fetch data: ${res.status}`);
        }
        const result = await res.json();
        
        console.log(`${activeSession} data:`, result);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSession, userId]);

  const renderMainContent = () => {
    if(!userId) return <p>Loading...</p>
    if (loading) return (
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
    );
    if (error) return <p className="text-red-500">{error}</p>;
    if (data.length === 0) return <p>No data available.</p>;

    return (
      <div className="space-y-4">
        {data.map((item) => {
          // Check if this is a review or a post
          if (activeSession === "Reviews" || activeSession === "LikedReviews") {
            return (
              <ReviewCard
                key={item._id}
                reviewId={item._id}
                movieId={item.movieId}
                username={item.username}
                review={item.review}
                likesNum={item.likesNum || 0}
                likedBy={item.likedBy || []}
                createdAt={item.createdAt}
                profileImg={item.profileImg}
                userId={currentUserId}
              />
            );
          } else {
            // For Posts and LikedPosts
            return (
              <PostCard
                key={item._id}
                userId={currentUserId}
                postId={item._id}
                username={item.username}
                content={item.content}
                likes={item.likes || 0}
                commentCount={item.commentCount || 0}
                shares={item.shares || 0}
                profileImg={item.profileImg}
                postImg={item.image || []}
                likedInitially={item.likedBy?.includes(currentUserId)}
                initialBookmarkCount={item.saveCounts || 0}
                initiallySaved={item.savedBy?.includes(currentUserId)}
                navigateTo={`/dashboard/posts/${item._id}`}
              />
            );
          }
        })}
      </div>
    );
  };

  if (!user) {
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
          ) : (
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
            <div className="flex gap-2">
              <FollowBtn userId={user._id} onCountsUpdate={(counts) => {
                if (typeof counts.followerCount === 'number') setFollowerCount(counts.followerCount);
                if (typeof counts.followingCount === 'number') setFollowingCount(counts.followingCount);
              }} />
            </div>
          </div>
          <p className="text-sm opacity-60 font-medium">{user.userID}</p>
          <p className="mt-4">{user.bio}</p>

          {/* Followers and Following */}
          <div className="flex space-x-5 mt-4">
            <div className="flex space-x-1">
              <p>{followerCount ?? user.followerCount ?? 0}</p>
              <p className="opacity-50 font-light">Followers</p>
            </div>
            <div className="flex space-x-1">
              <p>{followingCount ?? user.followingCount ?? 0}</p>
              <p className="opacity-50">Following</p>
            </div>
          </div>
        </div>

        {/* Session Buttons */}
        <div className="sticky top-0 z-50 mt-8 shadow-md">
          <div className="flex justify-center space-x-8">
            <button onClick={() => setActiveSection("Posts")} className={`${btnClass} ${activeSession === "Posts" ? "bg-stone-900" : ""}`}>Posts</button>
            <button onClick={() => setActiveSection("Reviews")} className={`${btnClass} ${activeSession === "Reviews" ? "bg-stone-900" : ""}`}>Reviews</button>
            <button onClick={() => setActiveSection("LikedPosts")} className={`${btnClass} ${activeSession === "LikedPosts" ? "bg-stone-900" : ""}`}>Liked Posts</button>
            <button onClick={() => setActiveSection("LikedReviews")} className={`${btnClass} ${activeSession === "LikedReviews" ? "bg-stone-900" : ""}`}>Liked Reviews</button>
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