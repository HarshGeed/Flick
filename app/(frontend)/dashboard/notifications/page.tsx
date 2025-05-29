"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function NotificationsPage() {
  const [sessionUserId, setSessionUserId] = useState(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/auth/session`);
        if (!res.ok) throw new Error("Session ID not fetched");
        const data = await res.json();
        setSessionUserId(data.userId); // Use data.userId, not the whole data object
      } catch (error) {
        console.error("Session not fetched", error);
      }
    };
    fetchSession();
  }, []);

  // Fetch notifications from backend
  useEffect(() => {
    if (!sessionUserId) return;
    setLoading(true);
    fetch(`/api/notifications/${sessionUserId}`)
      .then((res) => res.json())
      .then((data) => {
        // Defensive: ensure notifications is always an array
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setLoading(false);
        fetch(`/api/markRead/${sessionUserId}`, { method: "POST" }).then(() => {
        window.dispatchEvent(new Event("notifications-read"));
      });
      })
      .catch(() => {
        setNotifications([]);
        setLoading(false);
      });
  }, [sessionUserId]);

  return (
    <div className="max-w-2xl mx-auto px-4">
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
                {n.type === "save" && "saved your post"}
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