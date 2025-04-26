"use client";
import socket from "@/lib/socket";
import PostCard from "@/components/PostCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Signpost } from "lucide-react";

// Recursive Component for Comments & Replies
function CommentWithReplies({ comment, currentUserId }) {
  return (
    <div>
      <PostCard
        postId={comment._id}
        username={comment.user?.username || "Anonymous"}
        content={comment.text}
        likes={comment.likes || 0}
        commentCount={comment.replyCount || 0}
        shares={0}
        bookmarks={0}
        profileImg={comment.user?.profileImg || null}
        postImg={Array.isArray(comment.image) ? comment.image : []}
        likedInitially={comment.likedBy?.includes(currentUserId)}
        navigateTo={`/dashboard/${comment._id}/`}
      />

      {/* Render Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 border-l-2 border-gray-700 pl-4 mt-2">
          {comment.replies.map((reply) => (
            <CommentWithReplies
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SpecificPostContent() {
  const params = useParams();
  const postId = params.postId;
  const [currentUserId, setCurrentUserId] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the current user's session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          console.error("User not authenticated");
          return;
        }
        const data = await res.json();
        setCurrentUserId(data.userId);
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSession();
  }, []);

  // Handle real-time updates via sockets
  useEffect(() => {
    socket.on("new_comment", (data) => {
      if (data.postId === postId) {
        setComments((prevComments) => [...prevComments, data.comment]);
      }
    });

    socket.on("new_reply", (data) => {
      if (data.postId === postId) {
        const { parentCommentId, parentReplyId, reply } = data;

        if (parentCommentId) {
          // If the reply is for a comment
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === parentCommentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), reply],
                  }
                : comment
            )
          );
        } else if (parentReplyId) {
          // If the reply is for another reply (nested reply)
          const updateNestedReplies = (replies) =>
            replies.map((parentReply) =>
              parentReply._id === parentReplyId
                ? {
                    ...parentReply,
                    replies: [...(parentReply.replies || []), reply],
                  }
                : {
                    ...parentReply,
                    replies: updateNestedReplies(parentReply.replies || []),
                  }
            );

          setComments((prevComments) =>
            prevComments.map((comment) => ({
              ...comment,
              replies: updateNestedReplies(comment.replies || []),
            }))
          );
        }
      }
    });

    return () => {
      socket.off("new_comment");
      socket.off("new_reply");
    };
  }, [postId]);

  useEffect(() => {
    if (!postId) {
      console.error("Postid is missing");
      setLoading(false);
      return;
    }
    if (postId) {
      fetch(`/api/posts/${postId}/specificPost`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
            setLoading(false);
            return;
          }

          if (data.post) {
            setPost(data.post);
            setComments(data.comments || []);
            setReplies([]);
          } else if (data.comment) {
            setPost({ ...data.comment, content: data.comment.text });
            setComments([]);
            setReplies(data.replies || []);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          setLoading(false);
        });
    }
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (!post && comments.length === 0 && replies.length === 0)
    return <p>Post or comment not found.</p>;

  return (
    <div className="flex">
      {/* heading */}
      <div className="flex items-center absolute space-x-2 p-2 rounded-xl shadow-xl bg-gray-900 w-[8rem]">
        <Signpost strokeWidth={2.75} size={32} />
        {/* you may change the font style here  */}
        <h2 className="text-xl font-bold">POST</h2>
      </div>
      <div className="h-screen w-[36.5rem] mt-[4rem]">
        {post && (
          <PostCard
            postId={post._id}
            username={post.user?.username || "Anonymous"}
            content={post.content}
            likes={post.likes || 0}
            commentCount={comments.length}
            shares={post.shares || 0}
            bookmarks={post.bookmarks || 0}
            profileImg={post.user?.profileImg || null}
            postImg={Array.isArray(post.images) ? post.images : []}
            likedInitially={post.likedBy?.includes(currentUserId)}
            navigateTo={null}
          />
        )}
        {/* vertical line */}
        <div className="h-[3rem] border-1 border-white w-0 ml-[2rem] opacity-80"></div>
        {/* Render Comments */}
        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentWithReplies
                key={comment._id}
                comment={comment}
                currentUserId={currentUserId}
              />
            ))
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <CommentWithReplies
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <p className="text-gray-500 bg-gray-800 rounded-xl text-center py-4">
              No comments or replies yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
