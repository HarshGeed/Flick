import { Lato } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import SplitText from "@/components/LogoAnimation";
import "./globals.css";

export const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata = {
  title: "Flick - The movie social media website",
  description:
    "Here you can share views about movies, chat, make stories and posts, and do a lot more!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.className}>
      <body>
        <div className="flex flex-col items-start justify-center h-screen ml-[6rem]">
          <SplitText
            text=".Flick"
            className="text-9xl"
            delay={250}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            // rootMargin="-50px"
            // onLetterAnimationComplete={handleAnimationComplete}
          />
          <p className="w-[25rem]">
            Welcome to the world of cinephillis, where you can connect your
            cinema interests with the people like you
          </p>
        </div>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
