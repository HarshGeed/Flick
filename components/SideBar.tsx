import { Anton_SC } from "next/font/google";
import SideBarLink from "./SideBarLink";
import Image from "next/image";
import avatar from "@/public/avatar.jpg";
import { auth } from "@/auth";
import NotificationDot from "./NotificationDot";

import {
  Search,
  TrendingUp,
  MessageCircleMore,
  Megaphone,
  House,
  Bookmark,
  User,
  Clock10,
} from "lucide-react";
import Link from "next/link";
import CreatePostModal from "./CreatePostModal";


const logoFont = Anton_SC({
  weight: "400",
  subsets: ["latin"],
});

export default async function SideBar() {

  const session = await auth();

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
      <SideBarLink href="/dashboard" Icon={House}>
          Home
        </SideBarLink>
        <SideBarLink href="/explore" Icon={Search}>
          Explore
        </SideBarLink>
        <SideBarLink href="/dashboard/trending" Icon={TrendingUp}>
          Trending
        </SideBarLink>
        <SideBarLink href="/dashboard/watchlist" Icon={Clock10}>
          Watchlist
        </SideBarLink>
        <SideBarLink href="/dashboard/notifications" Icon={Megaphone}>
          Notifications
          {session?.user?.id && <NotificationDot userId={session?.user?.id}/>}
        </SideBarLink>
        <SideBarLink href="/dashboard/bookmarks" Icon={Bookmark}>
          Bookmarks
        </SideBarLink>
        <SideBarLink href="/dashboard/profilePage" Icon={User}>
          Profile
        </SideBarLink>

        {/* <button className=" rounded-xl h-12 text-xl bg-amber-200 text-black hover:opacity-90 transition duration-300 ease-in-out">
          Post
        </button> */}
        <CreatePostModal/>
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
            <p className="font-bold">{session?.user?.name || "Guest"}</p>
            <p className="font-extralight opacity-75">{session?.user?.email || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
