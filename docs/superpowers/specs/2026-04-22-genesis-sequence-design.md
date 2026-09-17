# Portfolio Design Spec: The Genesis Sequence

## Overview
A high-end, cinematic, interactive portfolio for Joel Shibu (AI Systems Developer & Robotics Engineer). The site aims for an "Awwwards 10/10" aesthetic, feeling less like a traditional webpage and more like a dive into a futuristic, intelligent neural network. The choreography heavily relies on React Three Fiber for 3D elements, GSAP for scroll hijacking and timelines, and Framer Motion for micro-interactions and glassmorphism.

## Target Audience
Recruiters, engineering leads, and peers. The goal is an immediate "wow" factor that establishes Joel as a top 1% developer capable of building complex, awe-inspiring systems.

## Core Tech Stack
- **Framework:** Next.js (App Router) / React
- **3D Rendering:** React Three Fiber, Drei (WebGL shaders and particles)
- **Animation & Choreography:** GSAP Core, GSAP ScrollTrigger (for scroll-hijacking and 3D camera movement)
- **Micro-interactions:** Framer Motion, Aceternity UI, Magic UI
- **Styling:** Tailwind CSS (with complex gradients, glassmorphism, and CSS variables)

## Architecture & Data Flow

### 1. Act I: The Awakening (Hero / Loader)
- **Concept:** A terminal boot sequence that shatters into a 3D neural brain.
- **Components:**
  - `BootSequenceLoader`: A fast-paced text loader showing real Python/ROS logs.
  - `NeuralBrain3D`: React Three Fiber canvas holding a particle mesh representing a brain/core.
  - `HeroTypography`: Brutalist typography ("JOEL SHIBU") that animates in post-load.
- **GSAP Role:** Orchestrating the loader fade-out, the particle shattering (via CustomEase/timelines), and the typography entrance.

### 2. Act II: The Neural Dive (Projects Showcase)
- **Concept:** Scrolling zooms the camera *into* the 3D brain tunnel instead of scrolling down the page.
- **Components:**
  - `ScrollTunnel`: The GSAP ScrollTrigger wrapper that pins the viewport.
  - `ProjectCard` (NeuroSight, RESP-AI): Frosted glassmorphism panels that lock into the center view as the user traverses the Z-axis.
- **GSAP Role:** `ScrollTrigger` with `scrub: true` mapped to the React Three Fiber camera's Z-position. Staggered fade-ins for project cards.

### 3. Act III: The Architecture (Tech Stack)
- **Concept:** A vast 3D planetary astrolabe displaying skills (Python, ROS, FastAPI, etc.).
- **Components:**
  - `SkillAstrolabe3D`: Interactive 3D solar system.
  - `SkillNode`: Individual skill planets that react to hover.
- **Interaction:** Mouse movement tilts the camera (parallax). Clicking a node fires a cinematic shockwave.

### 4. Act IV: The Hard Exit (Contact)
- **Concept:** A brutal cut to 2D minimalism with a massive magnetic button.
- **Components:**
  - `MagneticButton`: Framer Motion powered button that pulls towards the cursor.
  - `RadarBackground`: Subtle looping SVG/CSS animation.

## Testing Strategy
- **Performance:** Ensure WebGL context is properly optimized and disposed of when not in view. Maintain 60fps.
- **Responsiveness:** Fallback to simplified animations/GSAP timelines on mobile devices to save battery and performance.
- **Accessibility:** Respect `prefers-reduced-motion` using `gsap.matchMedia()` to disable the 3D dive and replace it with a graceful 2D fade-up version.

## Risks & Mitigations
- **Risk:** Scroll-hijacking can feel clunky on trackpads or magic mice.
  - **Mitigation:** Use GSAP ScrollSmoother or Lenis for buttery smooth scroll normalization before feeding the values into ScrollTrigger.
- **Risk:** High memory usage from React Three Fiber and particle systems.
  - **Mitigation:** Aggressive culling, low-poly geometries where possible, and using `useFrame` only when elements are in the viewport.

## Design Polish & Aesthetics
- **Typography:** Space Grotesk (Headers) and Inter/Geist (Body).
- **Colors:** Deep obsidian black, vibrant neural glowing accents (cyan, neon purple, and stark white).
- **Anti-Slop:** No generic templates. Every element will feature custom easing curves (`power4.out`, `expo.inOut`).

## Success Criteria
- [ ] Terminal loader correctly transitions into 3D space.
- [ ] ScrollTrigger perfectly syncs user scroll with the 3D camera Z-axis.
- [ ] Project cards appear and pause the 3D flight correctly.
- [ ] The entire site maintains 60fps on modern hardware.
- [ ] The experience works on mobile (with appropriate fallbacks).
