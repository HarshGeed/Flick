import NextAuth, {NextAuthConfig, Session, User as NextAuthUser} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/lib/dbConn";

interface CustomUser extends NextAuthUser{
  id: string;
  username?: string;
  isOauth?: boolean;
}

 const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if(!credentials?.email || !credentials?.password){
            throw new Error("Missing Email or Password");
          }
          
          await connect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) throw new Error("User not found");

          const isValidPassword = compare(credentials.password as string, user.password as string);

          if (!isValidPassword) throw new Error("Password is wrong");

          // console.log(user);
          return user as CustomUser;
        } catch (error) {
          console.log("Error =>", error.message);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful signin
      if (url.startsWith("/")) return `${baseUrl}/dashboard`;
      if (new URL(url).origin === baseUrl) return `${baseUrl}/dashboard`;
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { user, account, provider: account?.provider });
      if (account?.provider === "google") {
        try {
          await connect();
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });
          console.log("Existing user found:", !!existingUser);
          
          if (!existingUser) {
            // Create new user for Google OAuth
            const newUser = await User.create({
              username: user.name,
              email: user.email,
              isOauth: true,
            });
            console.log("New Google user created:", newUser.email);
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback triggered:", { hasUser: !!user, provider: account?.provider });
      await connect();
      if (account?.provider === "google") {
        // Find user in DB or create new one if not exists
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            username: user.name,
            email: user.email,
            isOauth: true,
          });
          console.log("User created in JWT callback:", dbUser.email);
        }

        token.id = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.username;
      } else if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = (user as CustomUser).username;
      }
      console.log("Token processed:", { id: token.id, email: token.email });
      return token;
    },
    async session({ session, token }) {
      // console.log("Session callback triggered with token:", token);
      if (token) {
       session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        emailVerified: new Date,
       };
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
 