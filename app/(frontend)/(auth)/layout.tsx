import { Lato } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import SplitText from "../../../components/LogoAnimation";
import "./globals.css";
import { ReactNode } from "react";

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

interface RootLayoutProps{
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={lato.className}>
      <body>
        <div className="flex flex-col items-start justify-center h-screen mx-[10.25rem]">
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
          <div className="w-[25rem] mt-[2rem] text-lg transform transition-transform duration-1000 ease-out translate-y-[-50px] animate-slide-in">
            <p className="opacity-75">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              eius adipisci minima deserunt sed aut corrupti nihil! Magni
              numquam architecto, dolores, suscipit minima necessitatibus
              reprehenderit officia quaerat quidem quibusdam eos.
            </p>
          </div>
        </div>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
