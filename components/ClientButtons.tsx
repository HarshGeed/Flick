"use client";

type Props = {
  activeBtn: "global" | "following";
  setActiveBtn: (btn: "global" | "following") => void;
};

export default function ClientButtons({ activeBtn, setActiveBtn }: Props) {
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

      {/* Following Button */}
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
