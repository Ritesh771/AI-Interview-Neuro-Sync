import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "../../globals.css";
import NavBar from "@/app/components/home/nav-bar";
import Provider from "@/app/provider";
import { ReactLenis } from "@/app/lib/lenis";
import Footer from "../../components/home/footer";
import Watermark from "@/app/components/ui/watermark";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroSync",
  description: "AI-powered interview practice platform",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${spaceGrotesk.className} w-full`}>
      <ReactLenis root options={{ lerp: 0.8, duration: 1.5 }}>
        <NavBar />
        {children}
        <Footer />
        <Watermark />
      </ReactLenis>
    </div>
  );
}