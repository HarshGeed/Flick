import { Lato } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import SplitText from "../../../components/LogoAnimation";
import "./globals.css";
import { ReactNode } from "react";
import Image from "next/image";
import bgImage from "@/public/bg-image.jpg";

const lato = Lato({
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

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={lato.className}>
      <body>
        {/* Background image */}
        <div className="fixed inset-0 -z-20">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        {/* Content */}
        <div className="relative flex flex-col items-start justify-center h-screen mx-[10.25rem] z-10">
          <SplitText
            text=".Flick"
            className="text-9xl"
            delay={250}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
          />
          <div className="w-[25rem] mt-[2rem] text-lg transform transition-transform duration-1000 ease-out translate-y-[-50px] animate-slide-in">
            <p className="opacity-75">
              Welcome to Flick – your space to explore movies and web series, share honest reviews, connect with others, and discover stories worth watching
            </p>
          </div>
        </div>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
