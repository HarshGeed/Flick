"use client";
import { useState } from "react";

export default function ClientButtons() {
  const [activeBtn, setActiveBtn] = useState("forYou"); // Default active button

  return (
    <div className="flex justify-center space-x-[5rem]">
      {/* For You Button */}
      <button
        onClick={() => setActiveBtn("forYou")}
        className={`w-[10rem] h-[3rem] rounded-xl ${
          activeBtn === "forYou" ? "bg-amber-200/90 text-black" : "bg-zinc-700 text-white"
        }`}
      >
        For You
      </button>

      {/* Genres Button */}
      <button
        onClick={() => setActiveBtn("genres")}
        className={`w-[10rem] h-[3rem] rounded-xl ${
          activeBtn === "genres" ? "bg-amber-200/90 text-black" : "bg-zinc-700 text-white"
        }`}
      >
        Genres
      </button>
    </div>
  );
}
