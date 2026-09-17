"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Robot3DScene } from "./Robot3DScene";
import { 
  ArrowDown, 
  ExternalLink, 
  Copy, 
  Check, 
  Award, 
  ArrowUpRight 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function RobotScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const email = "joelshibuadoor@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(() => {
    if (!containerRef.current || !pinSectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: pinSectionRef.current,
      scrub: 1.2,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, { scope: containerRef });

  const jumpToPhase = (phaseIndex: number) => {
    if (!containerRef.current) return;
    const start = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight - window.innerHeight;
    
    // Normalized phase midpoints
    const targetP = [0.05, 0.23, 0.41, 0.59, 0.77, 0.95][phaseIndex];
    window.scrollTo({
      top: start + height * targetP,
      behavior: "smooth",
    });
  };

  // Phase visibility ranges
  const isPhase0 = scrollProgress < 0.15;
  const isPhase1 = scrollProgress >= 0.15 && scrollProgress < 0.32;
  const isPhase2 = scrollProgress >= 0.32 && scrollProgress < 0.50;
  const isPhase3 = scrollProgress >= 0.50 && scrollProgress < 0.68;
  const isPhase4 = scrollProgress >= 0.68 && scrollProgress < 0.85;
  const isPhase5 = scrollProgress >= 0.85;

  return (
    <div 
      ref={containerRef} 
      id="experience" 
      className="relative w-full h-[600vh] bg-white"
    >
      <div 
        ref={pinSectionRef} 
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />

        {/* Central 3D Scene with Persistent Robot Actor & Dynamic Camera */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <Robot3DScene scrollProgress={scrollProgress} />
        </div>

        {/* Top Minimalist Brand Header */}
        <header className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">
              JS
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-neutral-900">
                JOEL SHIBU
              </div>
              <div className="font-mono text-[10px] text-neutral-400">
                AI SYSTEMS ENGINEER
              </div>
            </div>
          </div>

          {/* Real Location Coordinates */}
          <div className="font-mono text-xs text-neutral-400 hidden sm:block">
            09.9312° N, 76.2673° E · KERALA, INDIA
          </div>
        </header>

        {/* ========================================================
            PHASE 0: HERO OVERVIEW (p = 0.00 - 0.15)
        ======================================================== */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-between pt-28 pb-20 px-6 pointer-events-none transition-all duration-700 ${
            isPhase0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        >
          <div className="text-center max-w-3xl pointer-events-auto">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-neutral-900 leading-none mb-6">
              JOEL SHIBU
            </h1>
            <p className="text-neutral-600 text-base sm:text-lg md:text-xl font-normal max-w-xl mx-auto leading-relaxed mb-8">
              AI Systems Engineer & Full-Stack Developer. Building scalable machine learning pipelines, edge inference architectures, and autonomous robotics.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["PyTorch", "TensorFlow.js", "ROS", "OpenCV", "Next.js", "FastAPI", "ESP32"].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-mono text-xs border border-neutral-200/80">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 mb-2">
              SCROLL TO INITIATE SWIPE SEQUENCE
            </span>
            <button 
              onClick={() => jumpToPhase(1)}
              className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* ========================================================
            PHASE 1: NEUROSIGHT (p = 0.15 - 0.32)
            Right Arm Sweeps Leftward, Panel on Left
        ======================================================== */}
        <div 
          className={`absolute left-6 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-3rem)] md:w-[440px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase1 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 -translate-x-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-clean">
            <div className="font-mono text-xs font-bold text-sky-600 mb-2">
              01 {"//"} HEALTHCARE AI
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-1">
              NeuroSight
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-4">
              Privacy-First Neurological Screening AI
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
              AI-powered dementia and neurological screening through eye movement analysis. Deep learning models run entirely in-browser with zero server data retention.
            </p>

            {/* Real Performance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">94%</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Accuracy</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">47ms</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Latency</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">100%</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Client-Side</div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {["TensorFlow.js", "React 19", "FastAPI"].map((tag) => (
                <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            {/* Architecture Link */}
            <a 
              href="https://github.com/MedBotix/NeuroSight" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors"
            >
              <span>View Architecture & Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ========================================================
            PHASE 2: RESP-AI (p = 0.32 - 0.50)
            Left Arm Sweeps Rightward, Panel on Right
        ======================================================== */}
        <div 
          className={`absolute right-6 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-3rem)] md:w-[440px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase2 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 translate-x-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-clean">
            <div className="font-mono text-xs font-bold text-sky-600 mb-2">
              02 {"//"} ACOUSTIC INTELLIGENCE
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-1">
              RESP-AI
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-4">
              Real-Time Respiratory Monitoring
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
              Cross-platform mobile application utilizing CNN-based acoustic analysis for respiratory health tracking with live WebSockets streaming capability.
            </p>

            {/* Real Performance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">97.3%</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Accuracy</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">94ms</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Latency</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">48 kHz</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Stream</div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {["Flutter", "Python", "CNN", "WebSockets"].map((tag) => (
                <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href="https://github.com/MedTechHealth/RESP-AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors"
            >
              <span>View Architecture & Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ========================================================
            PHASE 3: AIRGUARDIAN (p = 0.50 - 0.68)
            High-Angle Overhead Drone View, Panel on Center-Left
        ======================================================== */}
        <div 
          className={`absolute left-6 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-3rem)] md:w-[440px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase3 
              ? "opacity-100 translate-y-[-50%] scale-100" 
              : "opacity-0 translate-y-[-45%] scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-clean">
            <div className="font-mono text-xs font-bold text-sky-600 mb-2">
              03 {"//"} AUTONOMOUS ROBOTICS
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-1">
              AirGuardian
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-4">
              Autonomous Drone Intelligence & SLAM
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
              Autonomous drone system for indoor air quality monitoring. Integrated IoT gas leak sensors with OpenCV navigation algorithms for real-time risk assessment.
            </p>

            {/* Real Performance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">500m²</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Coverage</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">8 Array</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Sensors</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-xl font-extrabold text-neutral-900">SLAM</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Vision</div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {["Python", "OpenCV", "ESP32", "INAV", "ROS"].map((tag) => (
                <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href="https://github.com/Joel-Shibu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors"
            >
              <span>Explore Robotics Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ========================================================
            PHASE 4: TECHNICAL ARSENAL (p = 0.68 - 0.85)
            3/4 CAD View, Holographic Stack Grid
        ======================================================== */}
        <div 
          className={`absolute left-6 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-20 max-w-xl w-[calc(100%-3rem)] md:w-[500px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase4 
              ? "opacity-100 translate-y-[-50%] scale-100" 
              : "opacity-0 translate-y-[-45%] scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-clean">
            <div className="font-mono text-xs font-bold text-sky-600 mb-2">
              04 {"//"} TECHNICAL ARSENAL
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-6">
              Engineering Stack
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  AI & MACHINE LEARNING
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["PyTorch", "TensorFlow.js", "Python", "OpenCV", "CNNs", "FastAPI"].map((s) => (
                    <span key={s} className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200/60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  ROBOTICS & EMBEDDED
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["ROS", "ESP32 C++", "Arduino", "INAV", "Sensor Fusion"].map((s) => (
                    <span key={s} className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200/60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  WEB & CLOUD INFRASTRUCTURE
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["React 19", "Next.js 16", "Docker", "GCP", "WebSockets", "Flutter"].map((s) => (
                    <span key={s} className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200/60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-4 border-t border-neutral-100">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                VERIFIED ACCREDITATION
              </div>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <div className="flex items-center space-x-2">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>Google Cloud — Prompt Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>Johnson & Johnson — Robotics & Controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>Electronic Arts — Software Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            PHASE 5: DIRECT CONTACT (p = 0.85 - 1.00)
            Frontal Eye-Level, Contact Channels
        ======================================================== */}
        <div 
          className={`absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 max-w-xl mx-auto pointer-events-auto transition-all duration-700 ease-out ${
            isPhase5 
              ? "opacity-100 translate-y-[-50%] scale-100" 
              : "opacity-0 translate-y-[-45%] scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-8 rounded-3xl border border-neutral-200/80 shadow-clean text-center">
            <div className="font-mono text-xs font-bold text-sky-600 mb-2">
              05 {"//"} DIRECT COMMS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mb-3">
              Initiate Contact
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
              Available for AI Systems Engineering, Robotics, and Machine Learning opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* Email */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-between">
                <div className="text-[10px] font-mono text-neutral-400 mb-2">EMAIL</div>
                <div className="flex items-center space-x-1.5 w-full">
                  <a 
                    href={`mailto:${email}`}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-900 text-white text-[11px] font-medium text-center hover:bg-neutral-800 transition-colors"
                  >
                    Write
                  </a>
                  <button 
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    title="Copy Email"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/in/joel-shibu-b6bb54352" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-between hover:bg-neutral-100/70 transition-colors"
              >
                <div className="text-[10px] font-mono text-neutral-400 mb-2">LINKEDIN</div>
                <div className="flex items-center space-x-1 text-xs font-bold text-neutral-900">
                  <LinkedInIcon className="w-4 h-4 text-sky-600" />
                  <span>Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </div>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/Joel-Shibu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-between hover:bg-neutral-100/70 transition-colors"
              >
                <div className="text-[10px] font-mono text-neutral-400 mb-2">GITHUB</div>
                <div className="flex items-center space-x-1 text-xs font-bold text-neutral-900">
                  <GitHubIcon className="w-4 h-4 text-neutral-900" />
                  <span>Code</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </div>
              </a>
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY · 2026
            </div>
          </div>
        </div>

        {/* Bottom Floating Interactive Phase Jump Pills */}
        <nav className="absolute bottom-6 z-30 flex items-center space-x-1.5 sm:space-x-2 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-neutral-200/80 shadow-clean pointer-events-auto">
          {["Init", "01 NeuroSight", "02 RESP-AI", "03 AirGuardian", "04 Stack", "05 Contact"].map((label, idx) => {
            const isActive = 
              (idx === 0 && isPhase0) ||
              (idx === 1 && isPhase1) ||
              (idx === 2 && isPhase2) ||
              (idx === 3 && isPhase3) ||
              (idx === 4 && isPhase4) ||
              (idx === 5 && isPhase5);

            return (
              <button
                key={label}
                onClick={() => jumpToPhase(idx)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                  isActive 
                    ? "bg-neutral-900 text-white shadow-sm scale-105" 
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {label.split(" ")[0]}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
