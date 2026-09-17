# The Genesis Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, high-end 3D portfolio site for an AI/Robotics engineer featuring a terminal boot loader, a scroll-hijacked dive through a neural tunnel, an interactive 3D skill astrolabe, and a magnetic contact section.

**Architecture:** Next.js App Router providing the shell. The main layout is a continuous vertical scroll mapped to a 3D camera Z-axis inside a React Three Fiber `<Canvas>`. The UI layer (HTML/CSS/Framer Motion) floats above the canvas.

**Tech Stack:** Next.js 14, React Three Fiber (R3F), Drei, GSAP (Core + ScrollTrigger), Framer Motion, Tailwind CSS, Lucide React.

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Initialize Next.js application**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install dependencies**

```bash
npm install three @types/three @react-three/fiber @react-three/drei gsap @gsap/react framer-motion clsx tailwind-merge lucide-react
```

- [ ] **Step 3: Setup utility functions (cn)**

Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Update Tailwind Config**

Modify `tailwind.config.ts` to add custom colors:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#FAFAFA",
        neural: {
          cyan: "#00F0FF",
          purple: "#8A2BE2",
        }
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

- [ ] **Step 5: Setup Global CSS and Layout**

Modify `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 2%;
    --foreground: 0 0% 98%;
  }
}

body {
  background-color: theme('colors.background');
  color: theme('colors.foreground');
  overflow-x: hidden;
  overscroll-behavior: none;
}

/* Hide scrollbar for cleaner look */
::-webkit-scrollbar {
  display: none;
}
```

Modify `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Joel Shibu | AI Systems Developer & Robotics Engineer",
  description: "Portfolio of Joel Shibu, specializing in Artificial Intelligence, Robotics Systems, and Scalable Software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold next.js project with dependencies and base styling"
```

---

### Task 2: Act I - Boot Sequence Loader

**Files:**
- Create: `src/components/BootSequenceLoader.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create the Terminal Loader Component**

Create `src/components/BootSequenceLoader.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const logs = [
  "INITIALIZING SYSTEM CORE...",
  "LOADING AI MODULES... [OK]",
  "ESTABLISHING ROS CONNECTION... [OK]",
  "MOUNTING NEURAL NETWORK... [OK]",
  "CALIBRATING SENSORS... [OK]",
  "SYSTEM ONLINE."
];

export default function BootSequenceLoader({ onComplete }: { onComplete: () => void }) {
  const [currentLog, setCurrentLog] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLog((prev) => {
        if (prev < logs.length - 1) return prev + 1;
        return prev;
      });
    }, 300);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500); // Small delay before hiding
          return 100;
        }
        return prev + 5; // Fast progression
      });
    }, 100);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col justify-end p-8 bg-black text-neural-cyan font-mono text-sm sm:text-base pointer-events-none"
    >
      <div className="flex flex-col gap-1 opacity-80">
        {logs.slice(0, currentLog + 1).map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="w-full max-w-md h-1 bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-neural-cyan transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-white">{progress}%</span>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add to Page**

Modify `src/app/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BootSequenceLoader from "@/components/BootSequenceLoader";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <main className="relative min-h-screen">
      <AnimatePresence>
        {!bootComplete && <BootSequenceLoader onComplete={() => setBootComplete(true)} />}
      </AnimatePresence>

      {/* Placeholder for 3D Canvas */}
      {bootComplete && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter text-white">
            JOEL SHIBU
          </h1>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BootSequenceLoader.tsx src/app/page.tsx
git commit -m "feat: add boot sequence loader animation"
```

---

### Task 3: Base 3D Canvas & GSAP Scroll Setup

**Files:**
- Create: `src/components/CanvasContainer.tsx`
- Create: `src/components/Scene.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create 3D Scene Wrapper**

Create `src/components/Scene.tsx`:
```tsx
"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!cameraRef.current) return;

    // The scroll-linked camera dive
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth catch-up
      }
    });

    // Move camera forward on Z axis
    tl.to(cameraRef.current.position, {
      z: -50,
      ease: "none"
    });
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={75} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />

      <group ref={groupRef}>
        {/* Placeholder Box for testing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8A2BE2" wireframe />
        </mesh>
        <mesh position={[0, 0, -20]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#00F0FF" wireframe />
        </mesh>
      </group>
    </>
  );
}
```

- [ ] **Step 2: Create Canvas Container**

Create `src/components/CanvasContainer.tsx`:
```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function CanvasContainer() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Setup Scroll Container in Page**

Modify `src/app/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BootSequenceLoader from "@/components/BootSequenceLoader";
import CanvasContainer from "@/components/CanvasContainer";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <main className="relative bg-background">
      <AnimatePresence>
        {!bootComplete && <BootSequenceLoader onComplete={() => setBootComplete(true)} />}
      </AnimatePresence>

      {/* Fixed 3D Background */}
      {bootComplete && <CanvasContainer />}

      {/* Scrollable Overlay Area */}
      {bootComplete && (
        <div id="scroll-container" className="relative z-10 w-full h-[500vh]">
          {/* Hero Section */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-9xl font-black tracking-tighter text-white mix-blend-difference"
            >
              JOEL SHIBU
            </motion.h1>
          </section>

          {/* We will map HTML overlays to scroll positions later */}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Scene.tsx src/components/CanvasContainer.tsx src/app/page.tsx
git commit -m "feat: setup r3f canvas and gsap scroll camera dive"
```

---

### Task 4: Act I & II - 3D Neural Particles & Tunnel

**Files:**
- Create: `src/components/NeuralBrain.tsx`
- Modify: `src/components/Scene.tsx`

- [ ] **Step 1: Create the Neural Brain Particle System**

Create `src/components/NeuralBrain.tsx`:
```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NeuralBrain({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  // Generate random positions in a sphere-like shape
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      temp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      temp[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      temp[i * 3 + 2] = r * Math.cos(phi);
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#00F0FF" 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 2: Add Tunnel Rings**

Update `src/components/Scene.tsx` to include the brain and tunnel rings along the Z-axis:
```tsx
"use client";

import { useRef } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NeuralBrain from "./NeuralBrain";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useGSAP(() => {
    if (!cameraRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Fly through the Z axis
    tl.to(cameraRef.current.position, {
      z: -100, // Travel deep into the tunnel
      ease: "none"
    });
  });

  // Generate tunnel rings
  const rings = Array.from({ length: 20 }).map((_, i) => (
    <mesh key={i} position={[0, 0, -i * 5 - 10]}>
      <torusGeometry args={[8, 0.05, 16, 100]} />
      <meshBasicMaterial color="#8A2BE2" transparent opacity={1 - (i * 0.05)} wireframe />
    </mesh>
  ));

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={75} />
      <ambientLight intensity={0.2} />
      <Environment preset="city" />

      <group position={[0, 0, 0]}>
        <NeuralBrain count={3000} />
      </group>
      
      {/* The Tunnel */}
      {rings}
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NeuralBrain.tsx src/components/Scene.tsx
git commit -m "feat: add 3d neural brain and quantum tunnel"
```

---

### Task 5: Act II - Glassmorphic Project Cards

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Project Card Component**

Create `src/components/ProjectCard.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
}

export default function ProjectCard({ title, description, tech, repoUrl, demoUrl }: ProjectCardProps) {
  return (
    <div className="w-[90vw] max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
      <h2 className="text-4xl font-display font-bold text-white mb-4">{title}</h2>
      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {tech.map((t, i) => (
          <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-neural-cyan border border-white/5">
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {repoUrl && (
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-neural-cyan transition-colors">
            <Github size={20} />
            <span className="font-mono text-sm">SOURCE</span>
          </a>
        )}
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-neural-purple transition-colors">
            <ExternalLink size={20} />
            <span className="font-mono text-sm">LIVE_SYSTEM</span>
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Project Overlay Sections**

Modify `src/app/page.tsx` to add the HTML sections that correspond to the scroll:
```tsx
// ... imports including ProjectCard ...
import ProjectCard from "@/components/ProjectCard";

// ... inside Home component return ...
      {/* Scrollable Overlay Area */}
      {bootComplete && (
        <div id="scroll-container" className="relative z-10 w-full h-[500vh]">
          {/* Hero Section - 100vh */}
          <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-9xl font-black tracking-tighter text-white"
            >
              JOEL SHIBU
            </motion.h1>
            <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.2, duration: 1 }}
               className="font-mono text-neural-cyan tracking-widest mt-4"
            >
              AI SYSTEMS & ROBOTICS ENGINEER
            </motion.p>
          </section>

          {/* Project 1 - 100vh spacer before it */}
          <section className="h-[150vh] w-full flex items-center justify-center px-4">
            <div className="sticky top-1/2 -translate-y-1/2">
              <ProjectCard 
                title="NeuroSight" 
                description="AI-powered medical intelligence system for healthcare data analysis. Built to process massive datasets rapidly using advanced deep learning architectures."
                tech={["Python", "PyTorch", "FastAPI", "React"]}
                repoUrl="https://github.com/MedBotix/NeuroSight"
              />
            </div>
          </section>

          {/* Project 2 */}
          <section className="h-[150vh] w-full flex items-center justify-center px-4">
            <div className="sticky top-1/2 -translate-y-1/2">
              <ProjectCard 
                title="RESP-AI" 
                description="AI respiratory health monitoring platform designed for intelligent breathing pattern analysis using sensor telemetry."
                tech={["ROS", "C++", "Python", "TensorFlow"]}
                repoUrl="https://github.com/MedTechHealth/RESP-AI"
              />
            </div>
          </section>
          
          <div className="h-screen" /> {/* Spacer for final camera zoom out */}
        </div>
      )}
// ... rest of component
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.tsx src/app/page.tsx
git commit -m "feat: add glassmorphic project cards in scroll overlay"
```

---

### Task 6: Act IV - The Magnetic Contact Section

**Files:**
- Create: `src/components/MagneticButton.tsx`
- Create: `src/components/ContactSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Magnetic Button**

Create `src/components/MagneticButton.tsx`:
```tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative px-12 py-6 bg-white text-black font-display font-bold text-2xl uppercase tracking-tighter rounded-full overflow-hidden group hover:scale-105 transition-transform"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-neural-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
    </motion.button>
  );
}
```

- [ ] **Step 2: Create Contact Section**

Create `src/components/ContactSection.tsx`:
```tsx
"use client";

import MagneticButton from "./MagneticButton";
import { Github, Linkedin, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative h-screen w-full bg-black flex flex-col items-center justify-center z-20 px-4">
      {/* Radar rings background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-neural-cyan rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-neural-purple rounded-full" />
      </div>

      <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-12 text-center uppercase">
        Initialize<br/>Sequence
      </h2>

      <MagneticButton onClick={() => window.location.href = "mailto:joelshibuadoor@email.com"}>
        Initiate Contact
      </MagneticButton>

      <div className="mt-20 flex gap-8">
        <a href="https://github.com/Joel-Shibu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <Github size={32} />
        </a>
        <a href="https://www.linkedin.com/in/joel-shibu-b6bb54352" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neural-cyan transition-colors">
          <Linkedin size={32} />
        </a>
        <a href="mailto:joelshibuadoor@email.com" className="text-gray-400 hover:text-white transition-colors">
          <Mail size={32} />
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add Contact to Page**

Modify `src/app/page.tsx` to append the contact section outside the scroll container:
```tsx
// ... imports ...
import ContactSection from "@/components/ContactSection";

// ... inside Home component return ...
      {/* Scrollable Overlay Area */}
      {bootComplete && (
        <div id="scroll-container" className="relative z-10 w-full h-[400vh]">
           {/* ... existing hero and project sections ... */}
        </div>
      )}

      {/* Final Contact Section */}
      {bootComplete && <ContactSection />}
// ...
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MagneticButton.tsx src/components/ContactSection.tsx src/app/page.tsx
git commit -m "feat: add magnetic contact section"
```

---

Plan complete and saved to `docs/superpowers/plans/2026-04-22-genesis-sequence-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?