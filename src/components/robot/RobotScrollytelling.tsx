"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Robot3DScene } from "./Robot3DScene";
import { 
  Radio, 
  Wind, 
  ExternalLink, 
  ArrowDown, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
  id: string;
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string; detail: string }[];
  tags: string[];
  link: string;
  accent: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: "neurosight",
    number: "01",
    tag: "HEALTHCARE AI & BCI",
    title: "NeuroSight",
    subtitle: "Privacy-First Neurological Screening AI",
    description: "Breakthrough AI-powered clinical screening system for dementia and neurological impairment through real-time eye gaze tracking. Operates entirely client-side with zero biometric data transmission.",
    metrics: [
      { label: "Accuracy", value: "94%", detail: "Clinical trial precision" },
      { label: "Latency", value: "47ms", detail: "Real-time edge inference" },
      { label: "Privacy", value: "100%", detail: "Zero-server data retention" },
    ],
    tags: ["TensorFlow.js", "React 19", "FastAPI", "WebAssembly"],
    link: "https://github.com/MedBotix/NeuroSight",
    accent: "#0284C7",
  },
  {
    id: "resp-ai",
    number: "02",
    tag: "ACOUSTIC INTELLIGENCE",
    title: "RESP-AI",
    subtitle: "Real-Time Respiratory Diagnostic Monitoring",
    description: "Cross-platform medical telemetry suite deploying deep convolutional neural networks for acoustic pulmonary classification, powered by bi-directional WebSocket telemetry.",
    metrics: [
      { label: "Accuracy", value: "97.3%", detail: "Validated acoustic score" },
      { label: "Latency", value: "94ms", detail: "Live stream response" },
      { label: "Channels", value: "8-Band", detail: "Spectral decomposition" },
    ],
    tags: ["Flutter", "Python", "PyTorch CNN", "WebSockets"],
    link: "https://github.com/MedTechHealth/RESP-AI",
    accent: "#0EA5E9",
  },
  {
    id: "airguardian",
    number: "03",
    tag: "AUTONOMOUS ROBOTICS & SLAM",
    title: "AirGuardian",
    subtitle: "Autonomous Indoor Drone Intelligence",
    description: "Autonomous unmanned aerial vehicle for hazardous environmental surveillance. Integrates multi-sensor gas telemetry with OpenCV edge vision and real-time SLAM spatial mapping.",
    metrics: [
      { label: "Coverage", value: "500m²", detail: "Autonomous search radius" },
      { label: "Sensors", value: "8 Array", detail: "Environmental gas fusion" },
      { label: "Navigation", value: "SLAM", detail: "Obstacle-free routing" },
    ],
    tags: ["Python", "ESP32", "OpenCV", "INAV", "ROS"],
    link: "https://github.com/Joel-Shibu",
    accent: "#38BDF8",
  },
];

export function RobotScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(0); // 0: Hero Intro, 1: NeuroSight, 2: RESP-AI, 3: AirGuardian

  useGSAP(() => {
    if (!containerRef.current || !pinSectionRef.current) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=350%", // Pinned for smooth cinematic scrub
      pin: pinSectionRef.current,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Map progress to distinct swipe phases
        if (p < 0.22) {
          setActivePhase(0);
        } else if (p < 0.52) {
          setActivePhase(1);
        } else if (p < 0.82) {
          setActivePhase(2);
        } else {
          setActivePhase(3);
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, { scope: containerRef });

  const jumpToPhase = (phaseIndex: number) => {
    if (!containerRef.current) return;
    const start = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight - window.innerHeight;
    
    // Map phase to scroll position
    const targetP = phaseIndex === 0 ? 0 : phaseIndex === 1 ? 0.35 : phaseIndex === 2 ? 0.65 : 0.95;
    window.scrollTo({
      top: start + height * targetP,
      behavior: "smooth",
    });
  };

  return (
    <div 
      ref={containerRef} 
      id="missions" 
      className="relative w-full h-[450vh] bg-gradient-to-b from-white via-[#F8FAFC] to-white"
    >
      <div 
        ref={pinSectionRef} 
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Architectural Subtle Grid & Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(2,132,199,0.05),transparent_65%)] pointer-events-none" />

        {/* Top Floating Telemetry Status Bar */}
        <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-3 pointer-events-auto">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-widest text-neutral-800 uppercase">
              Autonomous Core // System Online
            </span>
          </div>

          {/* Phase Telemetry Badge */}
          <div className="glass-panel px-4 py-1.5 rounded-full font-mono text-[11px] tracking-widest text-neutral-600 hidden sm:flex items-center space-x-2">
            <span className="text-sky-600 font-bold">
              {activePhase === 0 ? "INIT // READY" : `SEQ 0${activePhase} // REVEAL`}
            </span>
            <span className="text-neutral-300">|</span>
            <span>
              {activePhase === 0
                ? "AWAITING SCROLL SWIPE"
                : PROJECTS[activePhase - 1]?.title.toUpperCase()}
            </span>
          </div>

          <div className="font-mono text-xs text-neutral-500 hidden md:block">
            PROGRESS: {Math.round(scrollProgress * 100)}%
          </div>
        </div>

        {/* Central 3D Interactive Robot Canvas */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <Robot3DScene
            scrollProgress={scrollProgress}
            swipePhase={activePhase}
          />
        </div>

        {/* PHASE 0: Hero Welcome Overlay when at top */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 pointer-events-none transition-all duration-700 ${
            activePhase === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none"
          }`}
        >
          <div className="text-center max-w-xl px-6 pointer-events-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-600 mb-4">
              <Zap className="w-3.5 h-3.5 text-sky-500" />
              <span>AI SYSTEMS & ROBOTICS SHOWCASE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-3">
              Kinetic Scrollytelling
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-6">
              Scroll down to prompt the central robot to execute cinematic swipe gestures, revealing core architectural projects and neural systems.
            </p>
            <button 
              onClick={() => jumpToPhase(1)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium tracking-wide shadow-clean transition-all duration-200 hover:scale-[1.03]"
            >
              <span>Initiate First Swipe</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* ========================================================
            PROJECT DETAIL CARDS (SWIPED INTO FOCUS)
        ======================================================== */}

        {/* CARD 01: NeuroSight (Appears Left, Robot angled Right) */}
        <div 
          className={`absolute left-6 md:left-14 lg:left-24 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-3rem)] md:w-[460px] pointer-events-auto transition-all duration-700 ease-out ${
            activePhase === 1 
              ? "opacity-100 translate-x-0 scale-100" 
              : activePhase < 1 
                ? "opacity-0 -translate-x-16 scale-95 pointer-events-none" 
                : "opacity-0 -translate-x-16 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden border border-neutral-200/80 shadow-float">
            {/* Top Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  {PROJECTS[0].number} {"//"} {PROJECTS[0].tag}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACTIVE</span>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-1">
              {PROJECTS[0].title}
            </h3>
            <p className="text-xs md:text-sm font-medium text-neutral-500 mb-4">
              {PROJECTS[0].subtitle}
            </p>

            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6">
              {PROJECTS[0].description}
            </p>

            {/* Performance Metrics Bento */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {PROJECTS[0].metrics.map((m, idx) => (
                <div key={idx} className="bg-neutral-50/80 border border-neutral-100 rounded-xl p-3 text-center">
                  <div className="text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {PROJECTS[0].tags.map((tag) => (
                <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Link */}
            <a 
              href={PROJECTS[0].link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all duration-200"
            >
              <span>Explore Architecture & Repositories</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* CARD 02: RESP-AI (Appears Right, Robot angled Left) */}
        <div 
          className={`absolute right-6 md:right-14 lg:right-24 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-3rem)] md:w-[460px] pointer-events-auto transition-all duration-700 ease-out ${
            activePhase === 2 
              ? "opacity-100 translate-x-0 scale-100" 
              : activePhase < 2 
                ? "opacity-0 translate-x-16 scale-95 pointer-events-none" 
                : "opacity-0 translate-x-16 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden border border-neutral-200/80 shadow-float">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                {PROJECTS[1].number} {"//"} {PROJECTS[1].tag}
              </span>
              <div className="flex items-center space-x-1 text-sky-600 text-xs font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>STREAMING</span>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-1">
              {PROJECTS[1].title}
            </h3>
            <p className="text-xs md:text-sm font-medium text-neutral-500 mb-4">
              {PROJECTS[1].subtitle}
            </p>

            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6">
              {PROJECTS[1].description}
            </p>

            {/* Waveform Telemetry Visualizer */}
            <div className="mb-6 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2">
                <span>SPECTRAL ACOUSTIC PULSE</span>
                <span className="text-sky-600 font-bold">LIVE 48 kHz</span>
              </div>
              <div className="flex items-end space-x-1 h-8">
                {[40, 65, 85, 30, 95, 55, 75, 45, 90, 60, 35, 80, 50, 70, 40, 95, 60, 30].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-sky-400/80 rounded-t-sm transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Performance Metrics Bento */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {PROJECTS[1].metrics.map((m, idx) => (
                <div key={idx} className="bg-neutral-50/80 border border-neutral-100 rounded-xl p-3 text-center">
                  <div className="text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {PROJECTS[1].tags.map((tag) => (
                <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href={PROJECTS[1].link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all duration-200"
            >
              <span>View Acoustic Neural Model</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* CARD 03: AirGuardian (Appears Center-Left, Commanding Robot Stance) */}
        <div 
          className={`absolute left-6 md:left-14 lg:left-24 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-3rem)] md:w-[460px] pointer-events-auto transition-all duration-700 ease-out ${
            activePhase === 3 
              ? "opacity-100 translate-y-[-50%] scale-100" 
              : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden border border-neutral-200/80 shadow-float">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                {PROJECTS[2].number} {"//"} {PROJECTS[2].tag}
              </span>
              <div className="flex items-center space-x-1 text-emerald-600 text-xs font-mono">
                <Wind className="w-3.5 h-3.5" />
                <span>FLIGHT VERIFIED</span>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-1">
              {PROJECTS[2].title}
            </h3>
            <p className="text-xs md:text-sm font-medium text-neutral-500 mb-4">
              {PROJECTS[2].subtitle}
            </p>

            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6">
              {PROJECTS[2].description}
            </p>

            {/* Performance Metrics Bento */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {PROJECTS[2].metrics.map((m, idx) => (
                <div key={idx} className="bg-neutral-50/80 border border-neutral-100 rounded-xl p-3 text-center">
                  <div className="text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {PROJECTS[2].tags.map((tag) => (
                <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href={PROJECTS[2].link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all duration-200"
            >
              <span>Explore Robotics Architecture</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Bottom Floating Interactive Phase Jump Controller */}
        <div className="absolute bottom-6 z-30 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200/80 shadow-clean pointer-events-auto">
          <button
            onClick={() => jumpToPhase(0)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
              activePhase === 0 ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            INIT
          </button>
          {PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => jumpToPhase(idx + 1)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                activePhase === idx + 1 
                  ? "bg-neutral-900 text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <span>0{idx + 1}</span>
              <span className="hidden sm:inline">{proj.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
