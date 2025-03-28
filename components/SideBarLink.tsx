import Link from "next/link";

export default function SideBarLink({children, href, Icon}){
    return(
        <>
        <div className="flex flex-row w-[12rem] opacity-75 hover:opacity-100 rounded transition duration-200 ease-in-out">
            <Icon/>
            <Link href={href} className="ml-[1.2rem]">{children}</Link>
        </div>
        </>
    )
}