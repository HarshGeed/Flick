"use client";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";

export default function PostCard() {
  return (
    <div className="p-[1rem] rounded-xl shadow-2xl bg-stone-900">
      {/* Username and profile image */}
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Image
          src={avatar}
          alt="Profile image"
          width={40}
          height={40}
          className="rounded-full"
        />
        <p className="font-medium">Username</p>
      </div>
        <button className="bg-amber-50 text-black px-3 py-2 rounded-md hover:bg-amber-100 transition">
          Follow
        </button>
        </div>
      {/* Post content */}
      <div className="my-4">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi maiores quisquam voluptatem, odit perspiciatis vel repellendus odio? Soluta perspiciatis enim repellat voluptas, aut rerum accusamus qui dolore officia illum ipsa dolor est in dicta natus ex accusantium esse molestias pariatur? Eveniet ipsum ipsam, adipisci veritatis sed quisquam fugiat est asperiores numquam illo doloribus eum temporibus debitis dolore cupiditate eligendi quos magnam quaerat, fugit repellendus sit ipsa expedita. Nostrum similique consequuntur labore officia odio, temporibus, deleniti illo aliquid aut asperiores velit ad! Officiis aspernatur dolorem exercitationem ratione ipsum saepe ducimus natus est vel eligendi facilis architecto quo quasi quae suscipit error sequi explicabo fugit dicta numquam pariatur, dignissimos mollitia! Rem atque quas aliquid, nam nisi voluptates similique a fugiat velit commodi nulla et aspernatur sint eaque rerum cupiditate eveniet minima. Nulla laborum nesciunt officia fugit vero aut voluptatibus dolorum cumque in? Natus ex esse porro officia vero hic, quos quam consequuntur.</p>
      </div>
    </div>
  );
}
