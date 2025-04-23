"use client";

import PostCard from "@/components/PostCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Signpost } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

export default function SpecificPostContent() {
  const params = useParams();
  const postId = params.postId;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with actual session or auth logic
  const currentUserId = "replace_this_with_logged_in_user_id";

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
         
          if(data.post){
            setPost(data.post);
            setComments(data.comments || []);
            setReplies([])
          } else if(data.comment){
            setPost(
             { ...data.comment,
              content: data.comment.text,}
            )
            setComments([])
            setReplies(data.replies || [])
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
  if (!post && comments.length === 0 && replies.length === 0) return <p>Post or comment not found.</p>;

  return (
    <div className="flex">
      {/* heading */}
      <div className="flex items-center absolute space-x-2 p-2 rounded-xl shadow-xl bg-gray-900 w-[8rem]">
        <Signpost strokeWidth={2.75} size={32}/>
        {/* you may change the font style here  */}
      <h2 className="text-xl font-bold">POST</h2> 
      </div>
      <div className="h-screen w-[36.5rem] mt-[4rem]">
        {post && (<PostCard
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
        />)}
        {/* vertical line */}
        <div className="h-[3rem] border-1 border-white w-0 ml-[2rem] opacity-80"></div>
        {/* Render Comments */}
        <div className="space-y-3">
        {comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment._id}>
                
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
                
              </div>
            ))}
          </div>
        )}
        </div>
         {/* Render Replies */}
         {replies.length > 0 && (
          <div className="space-y-3">
            {replies.map((reply) => (
              <PostCard
                key={reply._id}
                postId={reply._id}
                username={reply.user?.username || "Anonymous"}
                content={reply.text}
                likes={reply.likes || 0}
                commentCount={reply.replyCount || 0}
                shares={0}
                bookmarks={0}
                profileImg={reply.user?.profileImg || null}
                postImg={Array.isArray(reply.image) ? reply.image : []}
                likedInitially={reply.likedBy?.includes(currentUserId)} 
                navigateTo={null}
              />
            ))}
          </div>
        )}

        {/* No Comments or Replies */}
        {comments.length === 0 && replies.length === 0 && (
          <p className="text-gray-500 bg-gray-800 rounded-xl text-center py-4">No comments or replies yet.</p>
        )}
      </div>
    </div>
  );
}
