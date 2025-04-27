"use client";
import Image from "next/image";
import { ArrowRightFromLine, Share, Bookmark, Repeat } from "lucide-react";
import Carousel from "./PostImageCarousel";
import default_userImg from "@/public/default-userImg.png";
import LikeButton from "./LikeButton";
import CommentBtn from "./CommentBtn";
import { useRouter } from "next/navigation";
import BookmarkBtn from "./BookmarkBtn";

// likeNum, commentNum, shareNum, bookmarkNum, repostNum, profileUrl

export default function PostCard({
  postId,
  username,
  content,
  likes,
  commentCount,
  shares,
  profileImg,
  postImg,
  likedInitially,
  initialBookmarkCount,
  initiallySaved,
  navigateTo,
}) {
  const router = useRouter();
  const handleCardClick = (e) => {
    // prevent click from firing when buttons inside are clicked
    if (navigateTo) router.push(navigateTo);
  };
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
            <LikeButton
              postId={postId}
              initialLikes={likes}
              likedInitially={likedInitially}
            />
          </div>
          <div className="flex items-center space-x-1">
            <CommentBtn
              postId={postId}
              content={content}
              username={username}
              profileImg={profileImg}
              commentCount={commentCount}
            />
          </div>
          <div className="flex items-center space-x-1">
            <Share strokeWidth={2} />
            <p className="text-sm">{shares}</p>
          </div>
          <div className="flex items-center space-x-1">
            <BookmarkBtn
              postId={postId}
              initialBookmarkCount={initialBookmarkCount}
              initiallySaved={initiallySaved}
            />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer relative group">
            <ArrowRightFromLine strokeWidth={2} onClick={handleCardClick} />
            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              View Post
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
