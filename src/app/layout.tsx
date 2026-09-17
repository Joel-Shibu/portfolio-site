import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GSAPInitializer } from "@/components/gsap-initializer";
import SmoothScrolling from "@/components/SmoothScrolling";
import CustomCursor from "@/components/CustomCursor";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-site-self-eta.vercel.app";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Joel Shibu (Joel) — AI Generalist & Full Stack Developer",
    template: "%s | Joel Shibu (Joel)",
  },
  description:
    "Official portfolio of Joel Shibu (Joel). AI Generalist and Full Stack Developer transforming research into real-world systems across healthcare diagnostics (NeuroSight, RESP-AI), autonomous robotics (AirGuardian), and agentic LLM integration based in Adoor, Kerala, India.",
  keywords: [
    "Joel",
    "Joel Shibu",
    "JoelShibu",
    "Joel AI",
    "Joel AI Generalist",
    "Joel Full Stack Developer",
    "Joel Kerala",
    "Joel Adoor",
    "Joel BMCE",
    "NeuroSight",
    "RESP-AI",
    "AirGuardian",
    "Healthcare AI",
    "Autonomous Robotics",
    "Edge Machine Learning",
    "TensorFlow.js",
    "PyTorch",
    "ROS 2",
    "SLAM",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Joel Shibu", url: baseUrl }],
  creator: "Joel Shibu",
  publisher: "Joel Shibu",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Joel Shibu (Joel) — AI Generalist & Full Stack Developer",
    description:
      "Transforming AI research into real-world systems across healthcare diagnostics, autonomous robotics, and agentic LLM integration.",
    url: baseUrl,
    siteName: "Joel Shibu — Official Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/joel-shibu.jpeg",
        width: 800,
        height: 800,
        alt: "Joel Shibu — AI Generalist & Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joel Shibu (Joel) — AI Generalist & Full Stack Developer",
    description:
      "AI Generalist & Full Stack Developer transforming research into real-world systems across healthcare diagnostics, autonomous robotics, and agentic LLM integration.",
    images: ["/images/joel-shibu.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Adoor, Kerala, India",
    "geo.position": "9.1530;76.7356",
    ICBM: "9.1530, 76.7356",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-neutral-900 selection:text-white`}>
        <CustomCursor />
        <SmoothScrolling>
          <GSAPInitializer>{children}</GSAPInitializer>
        </SmoothScrolling>
      </body>
    </html>
  );
}