'use client'
import { useEffect, useState } from "react"

export default function NotificationDot({userId}: {userId: string}){
    const [hasUnread, setHasUnread] = useState(false);
    const [sessionUserId, setSessionUserId] = useState(null);

    useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/auth/session`);
        if (!res.ok) throw new Error("Session ID not fetched");
        const data = await res.json();
        setSessionUserId(data.userId);
      } catch (error) {
        console.error("Session not fetched", error);
      }
    };
    fetchSession();
  }, []);

    useEffect(() => {
        const fetchUnread = () => {
            if(!sessionUserId) return;
            fetch(`/api/notifications/${sessionUserId}`)
            .then(res => res.json())
            .then(data => setHasUnread(!!data.unread))
            .catch(() => setHasUnread(false))
        };

        fetchUnread();
        // Listen for the custom event to refresh unread status
        const handler = () => fetchUnread();
        window.addEventListener("notifications-read", handler);
        return () => window.removeEventListener("notifications-read", handler);
    },[sessionUserId]);

    if(!hasUnread) return null;

    return(
        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle"></span>
    )
}