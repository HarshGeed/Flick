'use client'
import { signIn, signOut, useSession } from "next-auth/react";

const AuthComponent = () => {
  const { data: session } = useSession();

  return ""
}

export default AuthComponent;
