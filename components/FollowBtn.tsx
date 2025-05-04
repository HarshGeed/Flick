import { useEffect, useState } from "react";

export default function FollowBtn({ userId }) {

  const [isFollowing, setIsFollowing] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
        try{
            const res = await fetch("/api/auth/session");
            if(!res.ok) throw new Error("Failed to fetch session");
            const data = await res.json();
            setCurrentUserId(data.userId)
                
        }catch(err){
            console.error("Error fetching session:", err);
        }
    };
    fetchSession();
  }, []);

  const handleFollow = async () => {
    if (loading) return; // Prevent multiple clicks during loading
    setLoading(true);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUserId: userId, currentUserId }),
      });

      if (!res.ok) throw new Error("Failed to update follow status");

      setIsFollowing(!isFollowing); // Toggle follow state
    } catch (err) {
      console.error("Error updating follow status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-3 py-2 rounded-md transition ${
        isFollowing
          ? "bg-amber-200 text-black hover:bg-amber-300"
          : "bg-amber-50 text-black hover:bg-amber-200"
      }`}
      disabled={loading} // Disable button while loading
    >
      {loading ? "Processing..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}