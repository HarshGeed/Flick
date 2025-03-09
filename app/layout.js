import { Lato } from "next/font/google";

import "./globals.css";
import SideBar from "./components/SideBar";

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
      <body className="mx-[10.25rem] mt-[1.5rem]">
        <SideBar />
        {children}
      </body>
    </html>
  );
}
