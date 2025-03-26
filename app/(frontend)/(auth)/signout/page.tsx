// you need to delete this page it is only for testing purposes
// and next when you create the signout btn create it in different component and as server component because authjs v5 works like that
"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })} // Use `callbackUrl` instead of `redirectTo`
            className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
            Sign Out
        </button>
    );
}
