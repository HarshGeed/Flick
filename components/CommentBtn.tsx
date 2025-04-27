'use client'
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import CreateCommentModal from "./CreateCommentModal";
import socket from "@/lib/socket";

export default function CommentBtn({postId, content, username, profileImg, commentCount}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveCommentCount, setLiveCommentCount] = useState(commentCount || 0);

  useEffect(() => {
    const handleNewComment = (data) => {
      const { postId: incomingPostId } = data;
      if (incomingPostId === postId) {
        setLiveCommentCount(prev => prev + 1);
      }
    };
  
    socket.on("new_comment", handleNewComment);
  
    return () => {
      socket.off("new_comment", handleNewComment);
    };
  }, [postId]);
  
  
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-1 text-stone-400 hover:text-gray-700 transition cursor-pointer"
      >
        <MessageCircle strokeWidth={2} className="h-6 w-6" />
        <span className="text-sm">{liveCommentCount}</span>
      </button>

      {isModalOpen && (
        <CreateCommentModal
          postId={postId}
          postUsername={username}
          previewContent={content ? content.slice(0, 100) : ""}
          onClose={handleCloseModal}
          onOpen={handleOpenModal}
          postProfileImg={profileImg}
        />
      )}
    </>
  );
}