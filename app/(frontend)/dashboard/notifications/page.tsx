"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/notifications/${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session?.user?.id]);

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Notifications</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 rounded-lg ${
                n.isRead ? "bg-gray-800" : "bg-blue-900"
              } flex items-center gap-3`}
            >
              {n.senderId?.image && (
                <Image
                  src={n.senderId.image}
                  alt="sender"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
              <div>
                <span className="font-semibold">{n.senderId?.username}</span>{" "}
                {n.type === "like" && "liked your post"}
                {n.type === "comment" && "commented on your post"}
                {n.type === "reply" && "replied to your comment"}
                <div className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}