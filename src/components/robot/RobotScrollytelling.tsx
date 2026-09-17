"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Robot3DScene } from "./Robot3DScene";
import Image from "next/image";
import { 
  ArrowDown, 
  ExternalLink, 
  Copy, 
  Check, 
  Award, 
  ArrowUpRight,
  Briefcase
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
      scrub: 0.8,
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
    
    // Normalized phase targets
    const targets = [0.05, 0.25, 0.45, 0.65, 0.82, 0.96];
    window.scrollTo({
      top: start + height * targets[phaseIndex],
      behavior: "smooth",
    });
  };

  // Phase visibility ranges aligned with robot gestures
  const isPhase0 = scrollProgress < 0.15;
  const isPhase1 = scrollProgress >= 0.15 && scrollProgress < 0.35;
  const isPhase2 = scrollProgress >= 0.35 && scrollProgress < 0.55;
  const isPhase3 = scrollProgress >= 0.55 && scrollProgress < 0.75;
  const isPhase4 = scrollProgress >= 0.75 && scrollProgress < 0.90;
  const isPhase5 = scrollProgress >= 0.90;

  return (
    <div 
      ref={containerRef} 
      id="experience" 
      className="relative w-full h-[600vh] bg-white"
    >
      <div 
        ref={pinSectionRef} 
        className="relative w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center"
      >
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />

        {/* Central Component: Fixed 3D Robot with Dynamic Screen-Swiping Kinematics */}
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
          <Robot3DScene scrollProgress={scrollProgress} />
        </div>

        {/* Top Minimalist Location Indicator */}
        <header className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 pointer-events-none">
          <div className="font-mono text-[11px] sm:text-xs text-neutral-400 hidden sm:block">
            ADOOR, KERALA, INDIA
          </div>
        </header>

        {/* ========================================================
            PHASE 0: HERO OVERVIEW (p = 0.00 - 0.15)
        ======================================================== */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-between pt-16 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 pointer-events-none transition-all duration-700 ${
            isPhase0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        >
          <div className="text-center max-w-3xl pointer-events-auto mt-2 sm:mt-0">
            {/* Joel Shibu Studio Portrait Avatar */}
            <div className="relative w-16 h-16 sm:w-22 sm:h-22 md:w-24 md:h-24 mx-auto mb-3 sm:mb-5">
              <Image
                src="/images/joel-shibu.jpeg"
                alt="Joel Shibu"
                width={96}
                height={96}
                className="w-full h-full rounded-full object-cover border-2 border-white shadow-md ring-2 ring-neutral-200/80"
                priority
              />
            </div>

            <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-neutral-900 leading-none mb-2 sm:mb-4">
              JOEL SHIBU
            </h1>
            <div className="font-mono text-[11px] sm:text-xs md:text-sm font-semibold text-sky-600 tracking-wider uppercase mb-3 sm:mb-4 px-2">
              AI Engineering Student · APJ Abdul Kalam Technological University
            </div>
            <p className="text-neutral-600 text-sm sm:text-lg md:text-xl font-normal max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-4">
              AI Generalist & Full Stack Developer transforming research into real-world systems across healthcare diagnostics, autonomous robotics, and agentic LLM integration.
            </p>
          </div>

          <div className="flex flex-col items-center pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 mb-2">
              SCROLL TO EXPLORE PROJECTS
            </span>
            <button 
              onClick={() => jumpToPhase(1)}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all shadow-sm"
              aria-label="Scroll to explore projects"
            >
              <ArrowDown className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* ========================================================
            PHASE 1: NEUROSIGHT (p = 0.15 - 0.35)
            Right Arm Sweeps Leftward, Panel on Left
        ======================================================== */}
        <div 
          className={`absolute left-3 sm:left-8 lg:left-16 xl:left-20 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] md:w-[440px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase1 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 -translate-x-8 sm:-translate-x-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-neutral-200/80 shadow-clean max-h-[82dvh] sm:max-h-[88vh] overflow-y-auto">
            <div className="font-mono text-[11px] sm:text-xs font-bold text-sky-600 mb-1.5 sm:mb-2">
              01 {"//"} HEALTHCARE AI
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-1">
              NeuroSight
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-3 sm:mb-4">
              On-Device Neurological Health Screening
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 sm:mb-6">
              Browser-based AI platform for neurological screening through real-time eye-movement analysis. Built with TensorFlow.js and React to process all inference on-device for complete patient data privacy.
            </p>

            {/* Real Performance Metrics */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">94%</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Accuracy</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">47ms</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Latency</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">100%</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">On-Device Privacy</div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
              {["TensorFlow.js", "React 19", "FastAPI", "Python"].map((tag) => (
                <span key={tag} className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            {/* Architecture Link */}
            <a 
              href="https://github.com/MedBotix/NeuroSight" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors min-h-[44px]"
            >
              <span>View Repository & Architecture</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ========================================================
            PHASE 2: RESP-AI (p = 0.35 - 0.55)
            Low-Angle View, Respiratory Acoustic Stream
        ======================================================== */}
        <div 
          className={`absolute right-3 sm:right-8 lg:right-16 xl:right-20 top-1/2 -translate-y-1/2 z-20 max-w-lg w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] md:w-[450px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase2 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 translate-x-8 sm:translate-x-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-neutral-200/80 shadow-clean bg-white/88 backdrop-blur-md max-h-[82dvh] sm:max-h-[88vh] overflow-y-auto">
            <div className="font-mono text-[11px] sm:text-xs font-bold text-sky-600 mb-1.5 sm:mb-2">
              02 {"//"} ACOUSTIC AI
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-1">
              RESP-AI
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-3 sm:mb-4">
              Real-Time Pulmonary Acoustic Monitoring
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 sm:mb-6">
              Real-time respiratory health monitoring system utilizing CNN-based acoustic analysis and a two-stage cascade architecture. Streams 48 kHz audio over WebSockets with cross-platform Flutter deployment.
            </p>

            {/* Real Performance Metrics */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">97.3%</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Accuracy</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">94ms</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Latency</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">48 kHz</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Audio Stream</div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
              {["CNN", "Flutter", "WebSockets", "Python"].map((tag) => (
                <span key={tag} className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            {/* Architecture Link */}
            <a 
              href="https://github.com/MedTechHealth/RESP-AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors min-h-[44px]"
            >
              <span>View Repository & Architecture</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ========================================================
            PHASE 3: AIRGUARDIAN (p = 0.55 - 0.75)
            Tactical Overhead View, Drone Telemetry
        ======================================================== */}
        <div 
          className={`absolute left-3 sm:left-8 lg:left-16 xl:left-20 top-1/2 -translate-y-1/2 z-20 max-w-xl w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] md:w-[480px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase3 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 -translate-x-8 sm:-translate-x-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-neutral-200/80 shadow-clean bg-white/88 backdrop-blur-md max-h-[82dvh] sm:max-h-[88vh] overflow-y-auto">
            <div className="font-mono text-[11px] sm:text-xs font-bold text-sky-600 mb-1.5 sm:mb-2">
              03 {"//"} AUTONOMOUS ROBOTICS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-1">
              AirGuardian
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-3 sm:mb-4">
              Autonomous Indoor Drone for Environmental Intelligence
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 sm:mb-6">
              Autonomous indoor drone navigation system for environmental intelligence and industrial safety. Integrates 8-sensor IoT telemetry fusion with OpenCV visual processing and ROS SLAM mapping over 500m² coverage.
            </p>

            {/* Real Performance Metrics */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">500m²</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Coverage</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">8-Sensor</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Sensor Fusion</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-neutral-900">SLAM</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase mt-0.5 leading-tight">Autonomous Nav</div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
              {["OpenCV", "ESP32", "ROS", "SLAM"].map((tag) => (
                <span key={tag} className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {tag}
                </span>
              ))}
            </div>

            {/* Architecture Link */}
            <a 
              href="https://github.com/Joel-Shibu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors min-h-[44px]"
            >
              <span>View Robotics Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ========================================================
            PHASE 4: TECHNICAL ARSENAL (p = 0.75 - 0.90)
            Robot Taps & Unfolds Matrix
        ======================================================== */}
        <div 
          className={`absolute right-3 sm:right-8 lg:right-16 xl:right-20 top-1/2 -translate-y-1/2 z-20 max-w-xl w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] md:w-[480px] pointer-events-auto transition-all duration-700 ease-out ${
            isPhase4 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 translate-x-8 sm:translate-x-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-neutral-200/80 shadow-clean bg-white/88 backdrop-blur-md max-h-[82dvh] sm:max-h-[88vh] overflow-y-auto">
            <div className="font-mono text-[11px] sm:text-xs font-bold text-sky-600 mb-1.5 sm:mb-2">
              04 {"//"} TECHNICAL ARSENAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-1">
              Technical Arsenal
            </h2>
            <p className="text-xs font-medium text-neutral-500 mb-4 sm:mb-6">
              Verified production tools and engineering frameworks
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                  AI & Machine Learning
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["PyTorch", "TensorFlow", "TensorFlow.js", "OpenCV", "CNNs"].map((item) => (
                    <span key={item} className="text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Systems & Robotics
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["ROS / ROS2", "ESP32 (C++)", "Arduino", "SLAM", "WebSockets"].map((item) => (
                    <span key={item} className="text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Full-Stack, Cloud & DevOps
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["FastAPI", "React 19", "Flutter", "Docker", "GCP", "CI/CD", "Python", "TypeScript"].map((item) => (
                    <span key={item} className="text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            PHASE 5: DIRECT CONTACT & ACCREDITATIONS (p = 0.90 - 1.00)
            Direct Contact & Verified Credentials
        ======================================================== */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-3 sm:p-6 pointer-events-none transition-all duration-700 ease-out ${
            isPhase5 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-3xl border border-neutral-200/80 shadow-clean max-w-xl w-full text-center pointer-events-auto bg-white/92 backdrop-blur-md max-h-[85dvh] sm:max-h-[90vh] overflow-y-auto">
            {/* Joel Shibu Profile Photo */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 sm:mb-4">
              <Image
                src="/images/joel-shibu.jpeg"
                alt="Joel Shibu"
                width={112}
                height={112}
                className="w-full h-full rounded-full object-cover border-2 border-neutral-200 shadow-md ring-4 ring-neutral-100"
                priority
              />
            </div>

            <div className="font-mono text-[11px] sm:text-xs font-bold text-sky-600 mb-1">
              05 {"//"} GET IN TOUCH
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 mb-1">
              Joel Shibu
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-2">
              AI Engineering Student · APJ Abdul Kalam Technological University
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] sm:text-[11px] font-medium text-emerald-700 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Seeking 2026 Internships in AI & Robotics</span>
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 mb-4 sm:mb-5">
              BASELIOS MATHEWS II COLLEGE OF ENGINEERING · SASTHAMCOTTA, KERALA, INDIA
            </div>

            {/* Email Quick-Copy Card */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 mb-4 sm:mb-5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="font-mono text-xs sm:text-sm text-neutral-800 font-semibold truncate mr-2">
                {email}
              </span>
              <button
                onClick={handleCopyEmail}
                className="flex items-center space-x-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all shadow-sm flex-shrink-0 min-h-[36px]"
                aria-label="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Social & Code Channels */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <a
                href="https://www.linkedin.com/in/joel-shibu-b6bb54352/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-white border border-neutral-200/80 text-neutral-800 text-xs font-semibold hover:border-neutral-400 active:scale-95 transition-all shadow-sm group min-h-[44px]"
              >
                <LinkedInIcon className="w-4 h-4 text-sky-700" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://github.com/Joel-Shibu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-white border border-neutral-200/80 text-neutral-800 text-xs font-semibold hover:border-neutral-400 active:scale-95 transition-all shadow-sm group min-h-[44px]"
              >
                <GitHubIcon className="w-4 h-4 text-neutral-900" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Verified Accreditations & Experience */}
            <div className="pt-4 sm:pt-5 border-t border-neutral-100 text-left">
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                Experience & Accreditations
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-neutral-700">
                  <Briefcase className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>AI & Robotics Intern — STEM Robotics Internationals</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-700">
                  <Award className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Prompt Design in Vertex AI — Google Cloud</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-700">
                  <Award className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Robotics & Controls — Johnson & Johnson</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-700">
                  <Award className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Software Engineering — Electronic Arts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 z-30 pointer-events-none">
          <div 
            className="h-full bg-neutral-900 transition-all duration-75 ease-out"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
