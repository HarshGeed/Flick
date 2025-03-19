'use client'
import { signIn, signOut, useSession } from "next-auth/react";

const AuthComponent = () => {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Welcome, {session.user.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  ) : (
    <button onClick={() => signIn("google")}>Sign In with Google</button>
  );
}

export default AuthComponent;
