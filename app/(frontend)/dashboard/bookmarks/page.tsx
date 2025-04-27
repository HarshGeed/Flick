import { getBookmarks } from "@/lib/dbUtils";
import PostCard from "@/components/PostCard";
import { Signpost } from "lucide-react";
import { BookmarkCheck } from "lucide-react";

export default async function Bookmarks() {
  try {
    const savedPosts = await getBookmarks();

    if (savedPosts.length === 0) {
      return <p className="text-center text-gray-500 text-lg">No bookmarks found.</p>;
    }

    return (
      <div className="flex">
        <div className="flex items-center absolute space-x-2 p-2 rounded-xl shadow-xl bg-gray-900 w-[11rem]">
        <BookmarkCheck strokeWidth={2.75} size={32} />
        {/* you may change the font style here  */}
        <h2 className="text-xl font-bold">Bookmarks</h2>
      </div>
      <div className="h-screen w-[36.5rem] mt-[4rem]">
      <div className="space-y-4">
        {savedPosts.map((post) => (
          <PostCard
            key={post._id.toString()}
            postId={post._id}
            username={post.user?.username || "Anonymous"}
            content={post.content}
            likes={post.likes || 0}
            commentCount={post.comments?.length || 0}
            shares={post.shares || 0}
            profileImg={post.user?.profileImg || null}
            postImg={Array.isArray(post.images) ? post.images : []}
            likedInitially={post.likedBy?.includes(post.userId)}
            initialBookmarkCount={post.saveCounts || 0}
            initiallySaved={true}
            navigateTo={`/dashboard/${post._id}`}
          />
        ))}
      </div>
      </div>
      </div>
    );
  } catch (error) {
    if (error.message === "Unauthorized") {
      return <p className="text-center text-red-500 text-lg">Unauthorized. Please log in.</p>;
    }
    console.error(error);
    return <p className="text-center text-red-500 text-lg">Failed to fetch bookmarks.</p>;
  }
}
