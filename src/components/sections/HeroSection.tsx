"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Sparkles, Terminal } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(badgeRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
    })
      .from(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.98,
          duration: 1,
        },
        "-=0.5"
      )
      .from(
        descRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
        },
        "-=0.6"
      )
      .from(
        ctaRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
        },
        "-=0.6"
      )
      .from(
        metaRef.current,
        {
          opacity: 0,
          duration: 1,
        },
        "-=0.4"
      );
  }, { scope: containerRef });

  const scrollToMissions = () => {
    const el = document.getElementById("missions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={containerRef} 
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 bg-white overflow-hidden"
    >
      {/* Precision Geometric Grid Background */}
      <div className="absolute inset-0 bg-grid-light pointer-events-none opacity-80" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial-gradient pointer-events-none blur-3xl opacity-70" />

      {/* Top Floating Status Meta */}
      <div ref={metaRef} className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 text-xs font-mono text-neutral-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-500" />
          <span>SPEC: ARCHITECTURAL_WHITE // SYSTEM_V2.6</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>LAT/LONG: 09.9312° N, 76.2673° E</span>
          <span className="hidden sm:inline">APJ ABDUL KALAM TECHNOLOGICAL UNIV</span>
        </div>
      </div>

      {/* Center Stage Typographic Monument */}
      <div className="relative z-10 max-w-5xl mx-auto my-auto text-center py-12">
        {/* Sub-badge */}
        <div ref={badgeRef} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-xs font-mono text-neutral-700 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>AI SYSTEMS & AUTONOMOUS ROBOTICS</span>
        </div>

        {/* Headline */}
        <h1 
          ref={titleRef} 
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-neutral-900 leading-[0.9] mb-8 select-none"
        >
          JOEL SHIBU
        </h1>

        {/* Narrative description */}
        <p 
          ref={descRef} 
          className="text-neutral-500 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Architecting scalable artificial intelligence systems, real-time edge neural pipelines, and autonomous robotic navigation with surgical engineering rigor.
        </p>

        {/* Action CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToMissions}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium tracking-wide shadow-clean transition-all duration-200 hover:scale-[1.02]"
          >
            <span>Explore 3D Robot Showcase</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-sm font-medium tracking-wide transition-all duration-200 shadow-sm"
          >
            <span>Direct Transmission</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
          SCROLL TO INITIATE 3D ROBOT SWIPE
        </span>
        <div className="w-5 h-8 rounded-full border border-neutral-300 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-neutral-900 animate-bounce" />
        </div>
      </div>
    </section>
  );
}