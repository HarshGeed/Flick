"use client";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";
import { MessageCircle, Heart, Share, Bookmark, Repeat } from "lucide-react";
import Carousel from "./PostImageCarousel";

export default function PostCard({username, content, likeNum, commentNum, shareNum, bookmarkNum, repostNum, profileUrl}) {
  return (
    <div className="p-[1rem] rounded-xl shadow-2xl bg-stone-900">
      {/* Username and profile image */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src={avatar} // profileUrl will come here
            alt="Profile image"
            width={40}
            height={40}
            className="rounded-full"
          />
          <p className="font-medium">{username}</p>
        </div>
        <button className="bg-amber-50 text-black px-3 py-2 rounded-md hover:bg-amber-100 transition">
          Follow
        </button>
      </div>
      {/* Post content */}
      <div className="mt-4">
        <Carousel/> {/* We need to create the functioning here itself because or we can figure it out */}
      </div>
      <div className="mt-4">
        <p>
         {content}
        </p>
      </div>
      {/* Post features */}
      <div className="flex mt-4 items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Heart strokeWidth={1} />
          <p className="text-sm">{likeNum}</p>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle strokeWidth={1} />
          <p className="text-sm">{commentNum}</p>
        </div>
        <div className="flex items-center space-x-1">
          <Share strokeWidth={1} />
          <p className="text-sm">{shareNum}</p>
        </div>
        <div className="flex items-center space-x-1">
          <Bookmark strokeWidth={1} />
          <p className="text-sm">{bookmarkNum}</p>
        </div>
        <div className="flex items-center space-x-1"> 
          <Repeat strokeWidth={1} />
          <p className="text-sm">{repostNum}</p>
        </div>
      </div>
    </div>
  );
}
