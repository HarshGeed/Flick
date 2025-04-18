"use client";
import socket from "@/lib/socket";
import { Heart } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import clsx from "clsx";

type LikeButtonProps = {
  postId: string;
  likedInitially?: boolean;
  initialLikes?: number;
};

export default function LikeButton({
  postId,
  likedInitially = false,
  initialLikes = 0,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(likedInitially);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();
  const [animate, setAnimate] = useState(false);


  useEffect(() => {
    const handlePostLiked = (data: any) => {
      if (data.postId === postId) {
        setLikes(data.likes);
        setLiked(data.liked);
      }
    };

    socket.on("post_liked", handlePostLiked);
    return () => {
      socket.off("post_liked", handlePostLiked);
    };
  }, [postId]);

  const handleLike = async () => {
    if (isPending) return;

    const newLiked = !liked;
    const newLikes = likes + (newLiked ? 1 : -1);
    setLiked(newLiked);
    setLikes(newLikes);
    setAnimate(true);

    setTimeout(() => setAnimate(false), 500);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, {
          method: "PUT",
        });

        if (!res.ok) {
          throw new Error("Failed to update like");
        }

        const data = await res.json();

        // emit to socket server
        socket.emit("like_post", {
          postId,
          liked: newLiked,
          likes: newLikes,
        });

        setLiked(data.liked);
        setLikes(data.likes);
      } catch (error) {
        console.error(error);
        setLiked(!newLiked);
        setLikes((prev) => Math.max(prev - (newLiked ? 1 : -1), 0));
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-1 transition-transform duration-200 hover:scale-110 active:scale-95"
    >
      <Heart
        className={clsx(
          "h-6 w-6 transition-all duration-300",
          liked ? "fill-red-500 stroke-red-500" : "stroke-gray-400",
          animate && liked && "animate-bounce-like"
        )}
        strokeWidth={1}
      />
      <span className="text-sm text-gray-700">{likes}</span>
    </button>
  );
}
