import { Anton_SC } from "next/font/google";
import SideBarLink from "./SideBarLink";

import {
  Search,
  TrendingUp,
  MessageCircleMore,
  Megaphone,
  Users,
  Bookmark,
  User,
} from "lucide-react";

const logoFont = Anton_SC({
  weight: "400",
  subsets: ["latin"],
});

export default function SideBar() {
  return (
    <div>
      {/* logo */}
      <div className={logoFont.className}>
        <h1 className="text-4xl">.Flick</h1>
      </div>
      {/* menu options */}
      <div className="flex flex-col space-y-[1.5rem] mt-[2.2rem] text-2xl">
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

        <button className="w-[10rem] rounded-xl h-12 bg-amber-200 text-black hover:opacity-90 transition duration-300 ease-in-out">
          Post
        </button>
      </div>
    </div>
  );
}
