'use client';

import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
    >
      Log out
    </button>
  );
}
