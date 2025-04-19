"use client";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";
import { MessageCircle, Heart, Share, Bookmark, Repeat } from "lucide-react";
import Carousel from "./PostImageCarousel";
import default_userImg from "@/public/default-userImg.png";
import { useState } from "react";
import clsx from 'clsx'
import LikeButton from "./LikeButton";
import CommentBtn from "./CommentBtn";

// likeNum, commentNum, shareNum, bookmarkNum, repostNum, profileUrl

export default function PostCard({
  postId,
  username,
  content,
  likes,
  commentCount,
  shares,
  bookmarks,
  reposts,
  profileImg,
  postImg,
  likedInitially
}) {
  return (
    <div className="p-[1rem] rounded-xl shadow-2xl bg-stone-900">
      {/* Username and profile image */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src={profileImg || default_userImg} // profileUrl will come here
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
      <div className="mt-4">
        {Array.isArray(postImg) && postImg.length > 0 && (
          <Carousel images={postImg} />
        )}
        <div className="mt-4">
          <p>{content}</p>
        </div>
        {/* Post features */}
        <div className="flex mt-4 items-center space-x-3">
          <div className="flex items-center space-x-1">
            <LikeButton postId={postId} initialLikes={likes} likedInitially={likedInitially} />
          </div>
          <div className="flex items-center space-x-1">
            <CommentBtn postId={postId} content={content} username={username} profileImg={profileImg} commentCount={commentCount}/>
          </div>
          <div className="flex items-center space-x-1">
            <Share strokeWidth={1} />
            <p className="text-sm">{shares}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Bookmark strokeWidth={1} />
            <p className="text-sm">{bookmarks}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Repeat strokeWidth={1} />
            <p className="text-sm">{reposts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
