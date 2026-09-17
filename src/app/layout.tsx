import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GSAPInitializer } from "@/components/gsap-initializer";
import SmoothScrolling from "@/components/SmoothScrolling";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Joel Shibu — AI Systems Engineer & Robotics Developer",
  description: "High-performance AI systems, real-time ML pipelines, and autonomous robotics architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-neutral-900 selection:text-white`}>
        <CustomCursor />
        <SmoothScrolling>
          <GSAPInitializer>{children}</GSAPInitializer>
        </SmoothScrolling>
      </body>
    </html>
  );
}