# AUTONOMOUS JOURNEY PORTFOLIO
## Design Specification v1.0

**Date:** April 23, 2026
**Author:** Claude (Planning Phase)
**Status:** Draft — Pending User Approval

---

## CONCEPT OVERVIEW

**"A Story-Mode Game Portfolio Experience"**

Your portfolio is NOT a website. It's an **interactive cinematic experience** — a story-mode game where recruiters play through YOUR journey as the protagonist. Every scroll, every hover, every click reveals another chapter of the hero's arc.

**Tagline:** *"AI Systems Engineer | Building Next-Gen AI Systems"*

---

## DESIGN LANGUAGE

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Tactical Dark | `#0a0a0a` | Primary background |
| Deep Black | `#050505` | Alternate backgrounds |
| Electric Green | `#00FF88` | Success, active, power indicators |
| Warning Orange | `#FF6B35` | Alerts, energy, emphasis |
| Data Blue | `#00D4FF` | Information, tech, links |
| Pure White | `#FFFFFF` | Primary text |
| Muted Gray | `#888888` | Secondary text |
| Glass Border | `rgba(255,255,255,0.1)` | Translucent borders |

### Typography

- **Display Font:** Space Grotesk (bold, tech feel)
- **Mono Font:** Geist Mono (terminal text, code)
- **Body Font:** Inter (clean readability)

### Visual DNA

- **Cockpit/Mission Control aesthetic** — tactical HUD elements, data readouts
- **Story-mode game vibes** — missions, achievements, skill trees
- **Mechanical/robotic** — circuit patterns, joint animations, precision movements
- **Multi-layered depth** — parallax, z-index stacking, 3D transforms

---

## PHASE 0: LOADER — SYSTEM BOOT SEQUENCE

### Duration
3-4 seconds total

### Sequence

**0-0.5s: Black Screen**
- Subtle mechanical hum (optional audio)
- CRT-style scan line flickers

**0.5-1.5s: Circuit Pattern Trace**
- SVG circuit lines animate across screen (GSAP DrawSVG)
- Lines form robotic helmet/visor silhouette shape
- Lines glow Electric Green as they draw

**1.5-2.5s: Eye Activation**
- Glowing eye flickers to life at center of helmet
- Scanner beam sweeps LEFT to RIGHT
- Eye tracks mouse cursor after activation
- Power-up pulse radiates from eye

**2.5-4s: System Text**
- Text reveals with glitchy typewriter effect:
```
NEURAL LINK INITIALIZING...
████████████████████░░░░░░░ 78%
```
- Progress bar fills with glow
- Final flash when complete

**4s+: Helmet Opens**
- Helmet splits open from center (mechanical joint animation)
- Main content reveals through the opening
- Dramatic whoosh transition

### Components Used
- SVG `DrawSVGPlugin` — circuit lines animation
- GSAP timeline with `scrambleText` — glitchy reveal
- CSS scan line overlay (repeating gradient)
- Mouse tracking (Framer Motion `useMotionValue`)

---

## PHASE 1: HERO SECTION — THE PROTAGONIST AWAKENS

### Scene: Cockpit HUD Interface

### Layer Structure

| Layer | Element | Depth | Motion |
|-------|---------|-------|--------|
| 0 (back) | Animated mesh gradient + grid | 0.2x scroll | Slow drift |
| 1 | `Particles` component | 0.5x scroll | Continuous flow, mouse reaction |
| 2 | Data stream lines (vertical) | 0.8x scroll | Continuous upward flow |
| 3 | Tactical HUD frame (corner brackets) | 1x scroll | Pulse, subtle rotation |
| 4 | Main typography | 1x scroll | Animated reveal |
| 5 (front) | Scan line overlay | 3x scroll | Fast sweep |

### Content

```
┌─────────────────────────────────────────────────────────────┐
│  JOEL SHIBU                                                  │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  > AI SYSTEMS ENGINEER_                                     │
│  > HEALTHCARE AI SPECIALIST_                                │
│  > AUTONOMOUS SYSTEMS PILOT_                                │
│                                                             │
│  "Building Next-Gen AI Systems"                             │
│  "Advancing Agentic Capabilities"                           │
│                                                             │
│              [ ◆ VIEW MISSIONS ◆ ]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Animation Sequence (on load)

1. **Name letters** slam in one-by-one with impact bounce (GSAP SplitText)
2. **Glitch effect** flickers on name, resolves to clean (ScrambleText)
3. **Role text** types in with cursor blink (typewriter effect)
4. **Tagline** blur-fades in (`BlurFade` component, staggered)
5. **CTA button** materializes with scale-up from 0

### Micro-Interactions

- **Name hover:** Letters separate slightly, glow intensifies, tooltip appears
- **Magnetic cursor:** Letters pull toward cursor, spring back
- **Particle reaction:** Particles swirl around cursor position
- **CTA hover:** Pulse glow, slight float animation, icon rotates
- **CTA click:** Ripple effect, smooth scroll to missions

### Scroll Behavior

- Scroll down → Hero content scales (1 → 0.7), blurs, slides up
- Camera "flies forward" through particle field
- Background transitions into mission select
- GSAP ScrollTrigger with `scrub: 1`

### Components Used
- `Particles` (Magic UI) — mouse-reactive background
- `InteractiveGridPattern` (Magic UI) — tech grid
- `BlurFade` (Magic UI) — tagline reveal
- GSAP SplitText + DrawSVGPlugin — name animation
- Framer Motion `useSpring` — magnetic cursor effects
- GSAP ScrollTrigger — scroll-linked animations

---

## PHASE 2: MISSION SELECT — CHOOSE YOUR QUEST

### Scene: Tactical Mission Briefing Room

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│                    MISSION SELECT SCREEN                       │
│                   ═══════════════════════════                  │
├──────────────────────────────────────────────────────────────┬─┤
│                                                              │ │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │ │
│  │ MISSION 01     │ │ MISSION 02     │ │ MISSION 03     │ │ │
│  │ ═══════════    │ │ ═══════════    │ │ ═══════════    │ │ │
│  │ [BRAIN ICON]   │ │ [LUNGS ICON]   │ │ [DRONE ICON]   │ │ │
│  │                │ │                │ │                │ │ │
│  │ NEUROSIGHT     │ │ RESP-AI        │ │ AIRGUARDIAN    │ │ │
│  │ ──────────     │ │ ──────────     │ │ ──────────     │ │ │
│  │ Healthcare AI  │ │ Real-Time ML  │ │ Autonomous     │ │ │
│  │ [████████░░]   │ │ [████████░░]   │ │ [██████░░░]    │ │ │
│  │ ACTIVE         │ │ ACTIVE         │ │ ACTIVE         │ │ │
│  │                │ │                │ │                │ │ │
│  │ [ENTER MISSION]│ │ [ENTER MISSION]│ │ [ENTER MISSION]│ │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │ │
│                                                              │ │
│  ────────────────────────────────────────────────────────── │ │
│  ABOUT │ SKILLS │ CONTACT │ RESUME                           │ │
└──────────────────────────────────────────────────────────────┴─┘
```

### Panel Animations

- **Idle:** Circuit pattern pulse, border glow animation (pulse keyframe)
- **Hover:** Panel lifts (3D tilt with Framer Motion `useMotion3d` or CSS transform), border intensifies
- **Click:** Panel expands to fullscreen (flip animation, GSAP Flip plugin)

### Navigation Sidebar

- Cockpit control buttons with mechanical click feedback (CSS active states)
- Active section glows Electric Green
- Hover: button "presses" down with shadow change

### Background

- Large tactical map with animated scan line
- Floating mini-icons representing each mission
- Data streams flowing vertically

---

## PHASE 3: MISSION BRIEFING — NEUROSIGHT

### Entry Animation

- Previous content slides away with motion blur
- Mission panel flips open like a file folder
- Brain scan visualization materializes with scan-line sweep

### Content Sections

**Section 1: Mission Brief**

```
┌─────────────────────────────────────────────────────────────────┐
│ MISSION: NEUROSIGHT-01                                         │
│ ═══════════════════════════════════════════════════════════   │
│                                                                 │
│ OBJECTIVE: Browser-Based Neurological Screening                │
│ THREAT LEVEL: [████████░░] 80%                                  │
│ STATUS: ✓ THREAT NEUTRALIZED                                   │
│                                                                 │
│ ┌───────────────────────────────────────┐                     │
│ │      [3D BRAIN VISUALIZATION]         │                     │
│ │      Rotating, glowing synapses       │                     │
│ │      Particles flow through nerves     │                     │
│ └───────────────────────────────────────┘                     │
│                                                                 │
│ > BRIEFING:                                                     │
│ Privacy-first AI platform for eye-movement analysis.          │
│ TensorFlow.js processing — zero data leaves browser.          │
│                                                                 │
└────────────────────────���────────────────────────────────────────┘
```

**Animation Sequence (Scroll-Triggered):**
1. Mission title types in with glitch (ScrambleText)
2. Threat level bar fills with glow
3. 3D brain materializes (wireframe → solid)
4. Synapse particles flow
5. Briefing text fades in
6. "THREAT NEUTRALIZED" stamp slams down

**Section 2: Metrics Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│ PERFORMANCE METRICS                                             │
│ ═══════════════════════════════════════                        │
│                                                                 │
│ ACCURACY       PROCESSING    PRIVACY    PLATFORMS              │
│ [███████░░░] [████████░]  [████████] [██████░░░░]            │
│    94%            47ms        100%          3                   │
│                                                                 │
│ ────────────────────────────────────────────────────────────   │
│ TECH LOADOUT:                                                  │
│ [TensorFlow.js] [React] [FastAPI] [On-Device ML] [WebGL]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Animation:**
- Stats count up from 0 to real numbers
- Progress bars fill with particle trails
- Tech badges cascade in with mechanical precision

**Section 3: Architecture Diagram**
- Animated flowchart showing data pipeline
- Boxes connect with animated lines
- Real-time processing visualization

### Tech Stack Display
TensorFlow.js, React, FastAPI, TensorFlow, CNN, On-Device ML, WebGL

---

## PHASE 4: MISSION BRIEFING — RESP-AI

### Entry
Waveform "activates" with flicker effect

### Content

```
┌─────────────────────────────────────────────────────────────────┐
│ RESP-AI MONITORING DASHBOARD                                   │
│ ═══════════════════════════════════════════════════════════   │
│                                                                 │
│ LIVE WAVEFORM DISPLAY                                           │
│ ════════════════════                                           │
│ ~~~∿~~~~∿~~~~∿~~~~∿~~~~∿~~~~∿~~~~∿~~~~∿~~~~∿~~~~∿~~~~~~~     │
│     BREATH DETECTED: 14 BPM | STATUS: NORMAL ✓                  │
│                                                                 │
│ SYSTEM ARCHITECTURE                                             │
│ ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│ │ SENSORS │───▶│  CNN    │───▶│CASCADE  │───▶│OUTPUT  │      │
│ │  INPUT  │    │ STAGE 1 │    │ STAGE 2 │    │         │      │
│ └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│                                                                 │
│ KEY METRICS                                                     │
│ LATENCY: 94ms │ ACCURACY: 97.3% │ PLATFORMS: Mobile + Web       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animations

1. Waveform "powers on" with flicker
2. Data points stream in with particle effects
3. Architecture boxes connect one-by-one
4. Connection lines draw with DrawSVG
5. Numbers count up

### Tech Stack Display
Flutter, WebSocket, CNN, Python, TensorFlow, ROS, C++, Real-time

---

## PHASE 5: MISSION BRIEFING — AIRGUARDIAN

### Entry
Drone launches with thrust particle effect

### Content

```
┌─────────────────────────────────────────────────────────────────┐
│ AIRGUARDIAN — AUTONOMOUS DRONE SYSTEMS                          │
│ ═══════════════════════════════════════════════════════════   │
│                                                                 │
│ FLIGHT CONTROL INTERFACE                                        │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │   [MINI-MAP]           [ALTITUDE: 127m]                   │  │
│ │       .                     ════════                      │  │
│ │     . .    ●───────────     [====░░░░░░]                  │  │
│ │   .     .                  SENSOR GRID                   │  │
│ │         .                                                   │  │
│ │                      [DRONE SILHOUETTE]                   │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ MISSION DATA                                                    │
│ • Indoor environmental monitoring                              │
│ • IoT sensor integration (ESP32, INAV)                          │
│ • AI-powered autonomous navigation                             │
│                                                                 │
│ [MISSION COMPLETE ✓] with particle burst                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animations

1. Drone silhouette launches with thrust particles
2. Mini-map traces flight route
3. Altitude gauge needle animates
4. Sensor grid activates
5. "MISSION COMPLETE" with particle burst (Confetti component)

### Tech Stack Display
Python, ML, IoT, ESP32, INAV, Arduino, OpenCV, Autonomous Systems

---

## PHASE 6: SKILLS UNLOCKED — ABILITY GRID

### Scene
Character Skill Tree (RPG Style)

### Layout

```
                    [ULTIMATE]
                    LLM ORCHESTRATION
                    ═══════════════
                         │
         ┌───────────────┼───────────────┐
         │               │               │
      [NODE 1]        [NODE 2]        [NODE 3]
    AGENTIC AI     HEALTHCARE ML   AUTONOMOUS SYS
         │               │               │
    ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
  [S] [S] [S] [S] [S] [S] [S] [S] [S] [S] [S] [S]
```

### Skill Nodes

Each node:
- **Idle:** Glowing orb with circuit pattern animation
- **Hover:** Expands, shows proficiency percentage, tooltip with details
- **Active:** Pulsing glow, particles emanating

### Skills to Display

1. **Agentic AI** — Prompt Engineering (Vertex AI certified), Multi-agent systems, LLM orchestration
2. **Healthcare ML** — TensorFlow.js, CNNs, On-device inference, Privacy-first
3. **Autonomous Systems** — ROS, IoT (ESP32, INAV), Computer Vision (OpenCV)
4. **Production** — Docker, Kubernetes, FastAPI, WebSocket, Real-time streaming
5. **Full-Stack** — React, Flutter, Node.js, GCP, CI/CD

### Animation
Skills "unlock" progressively as you scroll — XP gain effect with Confetti burst on unlock

---

## PHASE 7: ABOUT — PERSONNEL FILE

### Scene
Dossier / Government File

### Content

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONNEL FILE                               │
│                    ═══════════════════                         │
│ ┌─────────────────┐                                             │
│ │  [PHOTO FRAME] │  NAME: JOEL SHIBU                           │
│ │  with scan      │  ROLE: AI SYSTEMS ENGINEER                 │
│ │  effect         │  CLEARANCE: ENGINEER LEVEL 5               │
│ └─────────────────┘  LOCATION: Adoor, Kerala, India            │
│                                                                 │
│ CHARACTER STATS                                                 │
│ ═══════════════════                                             │
│ INTELLIGENCE:   ████████████░░░░░░░░░░░░  85                     │
│ CREATIVITY:     █████████░░░░░░░░░░░░░░  70                     │
│ LEADERSHIP:     ████████████░░░░░░░░░░░  80                     │
│ TECHNICAL:      ████████████████████░░░  95                     │
│                                                                 │
│ CERTIFICATIONS                                                  │
│ ═══════════════════                                             │
│ [Badge] Google Cloud — Prompt Design                            │
│ [Badge] Johnson & Johnson — Robotics & Controls                │
│ [Badge] Electronic Arts — Software Engineering                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animations

- Photo frame has subtle scan-line effect
- Stats bars fill up on scroll with glow
- Certification badges "unlock" with medal ceremony effect (Confetti)
- Floating background: small clips drift

---

## PHASE 8: CONTACT — TRANSMISSION CENTER

### Scene
Communication Console / Radio Transmission

### Content

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMUNICATION CONSOLE                        │
│                    ═══════════════════════                     │
│                                                                 │
│          ╱╲     ╱╲     ╱╲     ╱╲     ╱╲                         │
│         ╱  ╲   ╱  ╲   ╱  ╲   ╱  ╲   ╱  ╲                        │
│   ────╱────╲─╱────╲─╱────╲─╱────╲─╱────╲────                   │
│        SIGNAL WAVES (animated)                                  │
│                                                                 │
│              "ESTABLISHING CONNECTION..."                       │
│                      ●●●○○○                                     │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │                                                           │  │
│ │   [ 📧 OPEN COMM LINK ]    Email                         │  │
│ │   [ 💼 SYNC PROFILE ]      LinkedIn                       │  │
│ │   [ 💻 ACCESS REPO ]        GitHub                         │  │
│ │   [ 📄 DOWNLOAD DOSSIER ]   Resume PDF                     │  │
│ │                                                           │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ STATUS: AWAITING RESPONSE... ██ (blinking)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animations

- Signal waves pulse continuously
- Hover on buttons: signal pulse sends out
- Click: transmission animation with "SIGNAL SENT" confirmation
- Background: continuous data transmission effect (Particles)

---

## PHASE 9: FINAL — ACHIEVEMENTS UNLOCKED

### Scene
Game Complete / End Credits

### Content

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ★ MISSION COMPLETE ★                        │
│                    ═══════════════════                          │
│                                                                 │
│              🎉 YOU'VE UNLOCKED ACHIEVEMENTS 🎉                 │
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│ │ 🏆           │ │ 🏆           │ │ 🏆           │            │
│ │ NEURAL LINK  │ │ PRIVACY      │ │ REAL-TIME    │            │
│ │ ESTABLISHED  │ │ GUARDIAN     │ │ RESPONDER    │            │
│ │              │ │              │ │              │            │
│ │ Browser ML   │ │ On-device    │ │ WebSocket    │            │
│ │ Pioneer      │ │ Processing   │ │ Architecture │            │
│ └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐                              │
│ │ 🏆           │ │ 🏆           │                              │
│ │ MULTI-AGENT  │ │ AUTONOMOUS   │                              │
│ │ MASTER       │ │ NAVIGATOR    │                              │
│ │              │ │              │                              │
│ │ Agentic AI   │ │ IoT + AI     │                              │
│ │ Systems      │ │ Integration  │                              │
│ └──────────────┘ └──────────────┘                              │
│                                                                 │
│             [ 🔄 RESTART JOURNEY ]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animations

- Confetti burst on load (Confetti component)
- Achievement cards stagger in with bounce
- Icons pulse continuously
- "RESTART JOURNEY" button scrolls to top with smooth animation

---

## COMPONENTS INVENTORY

### Core UI Components

| Component | Source | Usage |
|-----------|--------|-------|
| `Particles` | Magic UI | Mouse-reactive background |
| `InteractiveGridPattern` | Magic UI | Tech grid with scroll reactivity |
| `BlurFade` | Magic UI | Text reveal on scroll |
| `ScrollBasedVelocity` | Magic UI | Speed-reactive marquee text |
| `Confetti` | Magic UI | Celebration effects |
| `TypingAnimation` | Magic UI | Typewriter effects |
| `BentoGrid` | Aceternity | Project layout |
| `BackgroundBeams` | Aceternity | Ambient glow effects |

### Animation Libraries

| Library | Purpose |
|---------|---------|
| GSAP + ScrollTrigger | Scroll-linked animations, cinematic camera moves |
| GSAP DrawSVGPlugin | Circuit line drawing animations |
| GSAP SplitText | Character-by-character text animations |
| GSAP ScrambleText | Glitch effects |
| Framer Motion | Micro-interactions, magnetic cursor, 3D transforms |
| Three.js + React Three Fiber | 3D brain visualization, particles |
| Lenis | Smooth scrolling |

### Custom Components (To Build)

1. **BootSequenceLoader** — Robotic helmet boot animation
2. **CockpitHUD** — Tactical HUD frame overlay
3. **MissionCard** — 3D tilting mission panels
4. **MetricsCounter** — Animated stat counters
5. **SkillNode** — Glowing skill tree nodes
6. **AchievementCard** — Achievement unlock cards
7. **SignalWave** — Animated transmission waves
8. **WaveformDisplay** — Real-time monitoring display

---

## SCROLL ARCHITECTURE

### Scroll Sections (vertical height allocation)

| Phase | Section | Height | Trigger |
|-------|---------|--------|---------|
| 0 | Loader | 0vh | Auto / Click to skip |
| 1 | Hero | 100vh | Entry |
| 2 | Mission Select | 100vh | ScrollTrigger |
| 3 | NeuroSight | 200vh | ScrollTrigger + Pin |
| 4 | RESP-AI | 200vh | ScrollTrigger + Pin |
| 5 | AIRGUARDIAN | 200vh | ScrollTrigger + Pin |
| 6 | Skills | 150vh | ScrollTrigger |
| 7 | About | 100vh | ScrollTrigger |
| 8 | Contact | 100vh | ScrollTrigger |
| 9 | Achievements | 100vh | ScrollTrigger |

### Camera Motion

- **Hero → Mission Select:** Camera pulls back, zoom out
- **Mission Select → Missions:** Camera flies into selected mission
- **Within Missions:** Camera moves through Z-axis (depth)
- **Between Missions:** Camera cuts to next scene with transition
- **Contact:** Camera pulls back to reveal full transmission view

---

## PERFORMANCE CONSIDERATIONS

### Lazy Loading
- 3D brain visualization: Load on scroll near NeuroSight
- Heavy animations: Enable only when in viewport
- Particles: Reduce count on mobile

### Optimization
- Use `will-change` sparingly
- GPU-accelerate only animated elements
- Debounce scroll handlers
- Use `requestAnimationFrame` for smooth animations

---

## MOBILE ADAPTATION

### Changes for Mobile

- Disable 3D tilt on mission cards (use opacity instead)
- Reduce particle count to 50%
- Simplify HUD frame to corners only
- Stack mission cards vertically
- Reduce animation complexity
- Touch-friendly CTA buttons (larger hit areas)

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px | Single column, reduced animations |
| 640-1024px | 2-column mission grid |
| > 1024px | Full 3-column layout |

---

## ACCESSIBILITY

- Respect `prefers-reduced-motion`
- All interactive elements keyboard-navigable
- ARIA labels on custom components
- Skip-to-content button
- High contrast mode support
- Focus visible states

---

## FILES TO CREATE

### Components

```
src/
├── components/
│   ├── loaders/
│   │   └── BootSequenceLoader.tsx     (NEW)
│   ├── ui/
│   │   ├── CockpitHUD.tsx            (NEW)
│   │   ├── MissionCard.tsx           (NEW)
│   │   ├── MetricsCounter.tsx         (NEW)
│   │   ├── SkillNode.tsx              (NEW)
│   │   ├── AchievementCard.tsx       (NEW)
│   │   ├── SignalWave.tsx             (NEW)
│   │   ├── WaveformDisplay.tsx        (NEW)
│   │   └── ParticleBackground.tsx     (NEW - wrapper)
│   └── sections/
│       ├── HeroSection.tsx           (REFACTOR)
│       ├── MissionSelect.tsx         (NEW)
│       ├── NeuroSightSection.tsx     (NEW)
│       ├── RESPAISection.tsx         (NEW)
│       ├── AIRGUARDIANSection.tsx    (NEW)
│       ├── SkillsSection.tsx         (NEW)
│       ├── AboutSection.tsx          (NEW)
│       ├── ContactSection.tsx         (REFACTOR)
│       └── AchievementsSection.tsx   (NEW)
```

### Utilities

```
src/
├── lib/
│   ├── animations/
│   │   ├── gsap-setup.ts             (NEW - plugin registration)
│   │   ├── scroll-orchestrator.ts     (NEW - master scroll timeline)
│   │   └── magnetic-cursor.ts        (NEW - utility hook)
│   └── hooks/
│       ├── use-scroll-velocity.ts    (NEW)
│       └── use-lenis.ts             (NEW)
```

### Configuration

```
tailwind.config.ts    (UPDATE - add custom colors, fonts)
globals.css           (UPDATE - add loading animations, scan lines)
```

---

## TESTING CHECKLIST

- [ ] Loader completes without freezing
- [ ] All scroll triggers fire correctly
- [ ] Particles respond to mouse on desktop
- [ ] 3D tilt works on desktop, falls back on mobile
- [ ] All CTA buttons are functional
- [ ] Scroll is smooth (Lenis integration)
- [ ] No layout shift on load
- [ ] All animations respect reduced-motion preference
- [ ] Keyboard navigation works throughout
- [ ] Mobile layout is usable
- [ ] Performance: 60fps on modern devices

---

## DESIGN DOC REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 23, 2026 | Initial spec created |

---

## NEXT STEPS

1. User reviews and approves this design
2. Create implementation plan (writing-plans skill)
3. Begin Phase 0: Loader component
4. Build out infrastructure (Lenis, GSAP setup)
5. Implement each phase sequentially
6. Test and polish