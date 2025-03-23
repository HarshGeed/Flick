import { Anton_SC } from "next/font/google";
import SideBarLink from "./SideBarLink";
import Image from "next/image";
import avatar from "@/public/avatar.jpg";

import {
  Search,
  TrendingUp,
  MessageCircleMore,
  Megaphone,
  Users,
  Bookmark,
  User,
} from "lucide-react";
import Link from "next/link";

const logoFont = Anton_SC({
  weight: "400",
  subsets: ["latin"],
});

export default function SideBar() {
  return (
    <div className="fixed h-screen w-[12rem] flex flex-col">
      {/* logo */}
      <div className={logoFont.className}>
        <Link href="/">
          <h1 className="text-4xl">.Flick</h1>
        </Link>
      </div>
      {/* menu options */}
      <div className="flex flex-col flex-grow justify-center space-y-[1.5rem] text-2xl">
        <SideBarLink href="#" Icon={Search}>
          Explore
        </SideBarLink>
        <SideBarLink href="#" Icon={TrendingUp}>
          Trending
        </SideBarLink>
        <SideBarLink href="#" Icon={MessageCircleMore}>
          Messages
        </SideBarLink>
        <SideBarLink href="#" Icon={Megaphone}>
          Notifications
        </SideBarLink>
        <SideBarLink href="#" Icon={Users}>
          Communities
        </SideBarLink>
        <SideBarLink href="#" Icon={Bookmark}>
          Bookmarks
        </SideBarLink>
        <SideBarLink href="#" Icon={User}>
          Profile
        </SideBarLink>

        <button className=" rounded-xl h-12 bg-amber-200 text-black hover:opacity-90 transition duration-300 ease-in-out">
          Post
        </button>
        {/* showing the current user */}
        <div className=" h-[4rem] rounded-xl text-sm mt-[3rem] flex items-center p-2 hover:bg-gray-600/25 transition duration-300 ease-in-out">
        <div className="w-[2.5rem] h-[2.5rem] relative">
          <Image
            src={avatar}
            alt="User Image"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          />
        </div>
          <div className="ml-4">
            <p className="font-bold">Name</p>
            <p className="font-extralight opacity-75">Username</p>
          </div>
        </div>
      </div>
    </div>
  );
}
