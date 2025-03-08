import { Anton_SC } from "next/font/google"
import Link from "next/link"

const logoFont = Anton_SC({
    weight: '400',
    subsets: ['latin'],
  })

export default function SideBar(){
    return(
        <>
        {/* logo */}
        <div className={logoFont.className}>
            <h1 className="text-4xl">.Flick</h1>
        </div>
        {/* menu options */}
        <div className="flex flex-col space-y-[1.5rem] mt-[1.5rem] text-2xl">
            <Link href = "#">Explore</Link>
            <Link href = "#">Trending</Link>
            <Link href = "#">Messages</Link>
            <Link href = "#">Notifications</Link>
            <Link href = "#">Communities</Link>
            <Link href = "#">Bookmarks</Link>
            <Link href = "#">Profile</Link>
            
        </div>
        </>
    )
}