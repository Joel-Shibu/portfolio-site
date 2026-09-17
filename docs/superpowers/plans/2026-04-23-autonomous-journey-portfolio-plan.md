# Autonomous Journey Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing portfolio into a story-mode game experience with cinematic animations, 3D elements, and complex scroll interactions.

**Architecture:** Next.js 15 App Router with Tailwind CSS, Framer Motion for micro-interactions, GSAP ScrollTrigger for cinematic timeline orchestration, and Magic UI / Aceternity components for high-end visual effects.

**Tech Stack:** Next.js, React, Tailwind CSS, Framer Motion, GSAP (Core, ScrollTrigger, SplitText, DrawSVG), Three.js, React Three Fiber.

---

## Phase 1: Core Setup & Layout

### Task 1: Install Dependencies and GSAP Setup

**Files:**
- Modify: `package.json`
- Create: `src/lib/animations/gsap-setup.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install required packages**
```bash
npm install @gsap/react canvas-confetti @types/canvas-confetti clsx tailwind-merge
```

- [ ] **Step 2: Create GSAP Setup Utility**
Create `src/lib/animations/gsap-setup.ts`:
```typescript
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export function registerGSAP() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
  }
}
```

- [ ] **Step 3: Initialize GSAP in Layout**
Modify `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { registerGSAP } from "@/lib/animations/gsap-setup";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Joel Shibu | AI Systems Engineer",
  description: "Building Next-Generation AI Systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add package.json package-lock.json src/lib/animations/gsap-setup.ts src/app/layout.tsx
git commit -m "chore: install dependencies and setup gsap"
```

### Task 2: Configure Tailwind and Globals

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/lib/utils.ts`

- [ ] **Step 1: Update Tailwind Config**
Modify `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#FFFFFF",
        primary: "#00FF88",
        warning: "#FF6B35",
        info: "#00D4FF",
        muted: "#888888",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-space-grotesk)"],
        mono: ["var(--font-geist-mono)"],
      }
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Update Global CSS**
Modify `src/app/globals.css`:
```css
@import "tailwindcss";
@config "../../tailwind.config.ts";

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 0 0% 100%;
  }
  .dark {
    --background: 0 0% 4%;
    --foreground: 0 0% 100%;
  }
}

body {
  background-color: theme('colors.background');
  color: theme('colors.foreground');
  overflow-x: hidden;
  overscroll-behavior: none;
}

::-webkit-scrollbar {
  display: none;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 136, 0.2), transparent);
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
```

- [ ] **Step 3: Create cn utility if not exists**
Ensure `src/lib/utils.ts` exists:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Commit**
```bash
git add tailwind.config.ts src/app/globals.css src/lib/utils.ts
git commit -m "style: configure tailwind colors and global styles"
```

---

## Phase 2: UI Components

### Task 3: Interactive Grid Pattern Component

**Files:**
- Create: `src/components/ui/interactive-grid-pattern.tsx`

- [ ] **Step 1: Create Component**
Create `src/components/ui/interactive-grid-pattern.tsx`:
```tsx
"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number]
  className?: string
  squaresClassName?: string
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        "absolute inset-0 h-full w-full border border-white/5",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-white/5 transition-all duration-100 ease-in-out not-[&:hover]:duration-1000",
              hoveredSquare === index ? "fill-primary/20" : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        )
      })}
    </svg>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/ui/interactive-grid-pattern.tsx
git commit -m "feat: add interactive grid pattern component"
```

### Task 4: Particles Component

**Files:**
- Create: `src/components/ui/particles.tsx`

- [ ] **Step 1: Create Component**
Create `src/components/ui/particles.tsx`:
```tsx
"use client"

import React, { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

// Abridged for plan brevity - use the full Magic UI Particles implementation
// See: https://magicui.design/docs/components/particles
interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "")
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("")
  }
  const hexInt = parseInt(hex, 16)
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255]
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#00D4FF",
  vx = 0,
  vy = 0,
  ...props
}) => {
  // Use a simplified version for the plan that works safely
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} {...props}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.15)_0%,transparent_70%)] animate-pulse" />
      {/* Full canvas implementation goes here during execution */}
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/ui/particles.tsx
git commit -m "feat: add particles component"
```

### Task 5: Boot Sequence Loader

**Files:**
- Modify: `src/components/BootSequenceLoader.tsx`

- [ ] **Step 1: Update Loader Component**
Modify `src/components/BootSequenceLoader.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BootSequenceLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsReady(true), 500);
          setTimeout(onComplete, 1500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isReady ? 0 : 1, scale: isReady ? 1.5 : 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="relative w-full max-w-md p-8">
        <div className="absolute inset-0 border border-primary/30 rounded-lg" />
        {/* Simple circuit SVG for boot */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20">
          <path d="M10 50 L30 50 L40 30 L60 70 L70 50 L90 50" fill="none" stroke="#00FF88" strokeWidth="1" />
        </svg>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin mb-8" />
          
          <div className="font-mono text-primary text-sm mb-4 w-full text-center">
            {progress < 100 ? "NEURAL LINK INITIALIZING..." : "SYSTEM ONLINE"}
          </div>
          
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/BootSequenceLoader.tsx
git commit -m "feat: update boot sequence loader"
```

---

## Phase 3: Hero & Architecture

### Task 6: Hero Section Component

**Files:**
- Create: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Create Hero Component**
Create `src/components/sections/HeroSection.tsx`:
```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Particles } from "@/components/ui/particles";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <InteractiveGridPattern className="opacity-40" />
      <Particles className="opacity-60" color="#00D4FF" quantity={150} />
      
      {/* Content Layer */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center border border-white/10 bg-black/40 backdrop-blur-sm p-12 rounded-2xl"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4"
        >
          JOEL SHIBU
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-mono text-primary text-sm md:text-lg mb-8 space-y-1 text-center"
        >
          <p>&gt; AI SYSTEMS ENGINEER_</p>
          <p>&gt; HEALTHCARE AI SPECIALIST_</p>
          <p>&gt; AUTONOMOUS SYSTEMS PILOT_</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1 }}
          className="text-muted text-lg max-w-md text-center mb-12"
        >
          Building Next-Generation AI Systems. Advancing Agentic Capabilities.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-primary/10 border border-primary text-primary font-mono text-sm uppercase tracking-widest rounded transition-colors hover:bg-primary/20"
        >
          [ View Missions ]
        </motion.button>
      </motion.div>

      <div className="scan-line" />
    </section>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: create cinematic hero section"
```

### Task 7: Main Page Structure

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update Page Structure**
Modify `src/app/page.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { registerGSAP } from "@/lib/animations/gsap-setup";
import BootSequenceLoader from "@/components/BootSequenceLoader";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    registerGSAP();
  }, []);

  return (
    <main className="relative bg-background min-h-screen selection:bg-primary/30 selection:text-primary">
      <AnimatePresence mode="wait">
        {!bootComplete && <BootSequenceLoader key="loader" onComplete={() => setBootComplete(true)} />}
      </AnimatePresence>

      {bootComplete && (
        <div id="smooth-wrapper" className="relative z-10 w-full overflow-hidden">
          <div id="smooth-content">
            <HeroSection />
            {/* Sections will be added here */}
            <div className="h-screen flex items-center justify-center border-t border-white/5">
              <h2 className="font-mono text-muted">MISSION SELECT [WIP]</h2>
            </div>
            <div className="h-screen flex items-center justify-center border-t border-white/5">
              <h2 className="font-mono text-muted">NEUROSIGHT [WIP]</h2>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/page.tsx
git commit -m "feat: setup main page structure and scroll wrapper"
```

---

## Plan Complete and Saved
Plan complete and saved to `docs/superpowers/plans/2026-04-23-autonomous-journey-portfolio-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?