'use client'
import Image from "next/image";
import { useState } from "react";
import { Heart, MessageCircle, Repeat, Bookmark, Share2 } from "lucide-react";

interface PostCardProps {
  user: {
    name: string;
    // profileImage: string;
  };
  content: string;
  postImage?: string;
}

export default function PostCard({ user, content, postImage }: PostCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="shadow-md rounded-2xl p-4 w-full max-w-md mx-auto">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <Image
          src={user.profileImage}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <p className="font-semibold text-gray-900">{user.name}</p>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mt-2">{content}</p>

      {/* Post Image (If Exists) */}
      {postImage && (
        <div className="mt-3">
          <Image
            src={postImage}
            alt="Post"
            width={500}
            height={300}
            className="rounded-xl object-cover w-full"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-3 text-gray-600">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center space-x-1 ${
            liked ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart size={20} fill={liked ? "red" : "none"} />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1">
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1">
          <Share2 size={20} />
          <span>Share</span>
        </button>
        <button className="flex items-center space-x-1">
          <Repeat size={20} />
          <span>Repost</span>
        </button>
        <button className="flex items-center space-x-1">
          <Bookmark size={20} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
