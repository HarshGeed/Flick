import { useEffect, useState } from "react";

export default function FollowBtn({ userId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchSessionAndStatus = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Failed to fetch session");
        const data = await res.json();
        setCurrentUserId(data.userId);

        // Fetch follow status only if both IDs are present and not self
        if (data.userId && userId && data.userId !== userId) {
          const followRes = await fetch(
            `/api/follow?profileUserId=${userId}&currentUserId=${data.userId}`
          );
          if (followRes.ok) {
            const followData = await followRes.json();
            setIsFollowing(followData.isFollowing);
          }
        }
      } catch (err) {
        console.error("Error fetching session or follow status:", err);
      }
    };
    fetchSessionAndStatus();
  }, [userId]);

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUserId: userId, currentUserId }),
      });

      if (!res.ok) throw new Error("Failed to update follow status");

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Error updating follow status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hide button if user is viewing their own profile
  if (currentUserId === userId) return null;

  return (
    <button
      onClick={handleFollow}
      className={`px-3 py-2 rounded-2xl shadow-lg cursor-pointer transition ${
        isFollowing
          ? "bg-[#582c79] text-white hover:opacity-70"
          : "bg-amber-50 text-black hover:opacity-70"
      }`}
      disabled={loading}
    >
      {loading ? "Processing..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}