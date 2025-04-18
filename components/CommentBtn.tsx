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
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
      >
        <MessageCircle strokeWidth={1} className="h-5 w-5" />
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