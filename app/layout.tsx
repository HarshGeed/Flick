import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Flick - The movie social media website",
  description:
    "Here you can share views about movies, chat, make stories and posts, and do a lot more!",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
