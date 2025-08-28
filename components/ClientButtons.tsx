"use client";
import { useState } from "react";

export default function ClientButtons() {
  const [activeBtn, setActiveBtn] = useState<"global" | "following">("global"); // Default active button

  return (
    <div className="flex justify-center space-x-[5rem]">
      {/* For You Button */}
      <button
        onClick={() => setActiveBtn("global")}
        className={`w-[10rem] h-[3rem] rounded-xl ${
          activeBtn === "global" ? "bg-amber-200/90 text-black" : "bg-zinc-700 text-white"
        }`}
      >
        Global
      </button>

      {/* Genres Button */}
      <button
        onClick={() => setActiveBtn("following")}
        className={`w-[10rem] h-[3rem] rounded-xl ${
          activeBtn === "following" ? "bg-amber-200/90 text-black" : "bg-zinc-700 text-white"
        }`}
      >
        Following
      </button>
    </div>
  );
}
