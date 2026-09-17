"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MissionBriefingProps {
  missionId: string;
  onBack: () => void;
}

const missionsData: Record<string, {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  image: string;
  gallery: string[];
  description: string;
  objectives: string[];
  tech: string[];
  metrics: Record<string, string | number>;
  achievements?: string[];
}> = {
  neurosight: {
    id: "neurosight",
    title: "NEUROSIGHT",
    subtitle: "Healthcare AI / Brain-Computer Interface",
    icon: "🧠",
    color: "#00FF88",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2500&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620825937374-87fc7d62828e?q=80&w=1500&auto=format&fit=crop"
    ],
    description: "Privacy-first AI platform for eye-movement analysis using TensorFlow.js. Enables early neurological screening through machine learning analysis of eye movements. The entire pipeline operates locally in the browser, ensuring patient data never leaves the device.",
    objectives: [
      "Develop on-device ML model for eye-tracking",
      "Achieve 90%+ accuracy in screening",
      "Ensure 100% privacy (no cloud processing)",
      "Cross-browser compatibility"
    ],
    tech: ["TensorFlow.js", "React", "FastAPI", "On-Device ML"],
    metrics: { accuracy: "94%", latency: "47ms", privacy: "100%", platforms: 3 },
    achievements: ["Best Healthcare AI Project 2025"]
  },
  "resp-ai": {
    id: "resp-ai",
    title: "RESP-AI",
    subtitle: "Real-Time Respiratory Monitoring",
    icon: "💨",
    color: "#00D4FF",
    image: "https://images.unsplash.com/photo-1620825937374-87fc7d62828e?q=80&w=2500&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1500&auto=format&fit=crop"
    ],
    description: "CNN-based acoustic analysis system with 2-stage cascade architecture for real-time respiratory monitoring. The system continuously listens to audio streams and utilizes edge computing to instantly detect anomalies in breath patterns.",
    objectives: [
      "Real-time audio processing",
      "97%+ accuracy in breath detection",
      "Sub-100ms latency requirement",
      "Mobile and web support"
    ],
    tech: ["Flutter", "WebSocket", "CNN", "Python"],
    metrics: { accuracy: "97.3%", latency: "94ms", platforms: 2 }
  },
  airguardian: {
    id: "airguardian",
    title: "AIRGUARDIAN",
    subtitle: "Autonomous Drone Systems",
    icon: "🚁",
    color: "#FF6B35",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=2500&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1500&auto=format&fit=crop"
    ],
    description: "AI-powered indoor environmental intelligence with IoT integration. Autonomous drone system for indoor monitoring capable of navigating complex spaces without GPS, using optical flow and simultaneous localization and mapping (SLAM).",
    objectives: [
      "Autonomous navigation",
      "500m² coverage area",
      "50m altitude ceiling",
      "8-sensor fusion"
    ],
    tech: ["Python", "ESP32", "OpenCV", "INAV"],
    metrics: { coverage: "500m²", altitude: "50m", sensors: 8 }
  }
};

export default function MissionBriefing({ missionId, onBack }: MissionBriefingProps) {
  const mission = missionsData[missionId];
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const galleryRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero image parallax
    if (heroImageRef.current) {
      gsap.to(heroImageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }

    // Gallery images parallax
    galleryRefs.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, {
          yPercent: i % 2 === 0 ? 20 : -20,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    });

  }, { scope: containerRef });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!mission) return null;

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-black overflow-x-hidden">
      {/* Cinematic Hero Header */}
      <div className="relative w-full h-[80vh] flex items-end pb-24 px-4 md:px-12 overflow-hidden">
        {/* Background Image Parallax */}
        <div className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none">
          <img 
            ref={heroImageRef}
            src={mission.image} 
            alt={mission.title}
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-12 left-4 md:left-12 z-50 flex items-center gap-4 font-mono text-sm text-white/50 hover:text-white transition-colors group mix-blend-difference"
        >
          <div className="w-12 h-px bg-white/50 group-hover:bg-white transition-colors group-hover:-translate-x-2 duration-300" />
          <span className="tracking-[0.2em]">[ ABORT MISSION ]</span>
        </button>

        {/* Header Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto mix-blend-exclusion">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-8">
              <span className="font-mono text-sm tracking-[0.4em] uppercase" style={{ color: mission.color }}>
                {mission.id} {"//"} ACTIVE
              </span>
            </div>
            
            <h1 
              className="font-display text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.85] mb-6 text-white"
            >
              {mission.title}
            </h1>
            <p className="font-mono text-xl md:text-3xl text-white/60 max-w-3xl tracking-tight">
              {mission.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 py-32">
        
        {/* Gallery & Description Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
          
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-mono text-xs tracking-[0.3em] text-white/30 mb-8 border-b border-white/10 pb-6">
                01 // MISSION OVERVIEW
              </h3>
              <p className="text-2xl md:text-4xl text-white/90 leading-tight font-light mix-blend-difference">
                {mission.description}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {mission.gallery.map((img, i) => (
              <div key={i} className={`relative w-full h-[50vh] md:h-[60vh] overflow-hidden ${i === 1 ? 'md:mt-32' : ''}`}>
                <div className="absolute inset-0 bg-white/5 border border-white/10" />
                <img 
                  ref={(el) => { galleryRefs.current[i] = el; }}
                  src={img} 
                  alt={`${mission.title} visual ${i + 1}`}
                  className="absolute -top-[20%] left-0 w-full h-[140%] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Tech & Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Objectives */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-mono text-xs tracking-[0.3em] text-white/30 mb-12 border-b border-white/10 pb-6">
              02 // PRIMARY OBJECTIVES
            </h3>
            <div className="space-y-8">
              {mission.objectives.map((objective, index) => (
                <div key={index} className="flex gap-8 items-start group">
                  <span 
                    className="font-mono text-2xl font-bold transition-colors duration-500"
                    style={{ color: `${mission.color}40` }}
                  >
                    0{index + 1}
                  </span>
                  <p className="text-xl md:text-2xl text-white/70 group-hover:text-white transition-colors duration-500">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack & Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-mono text-xs tracking-[0.3em] text-white/30 mb-12 border-b border-white/10 pb-6">
              03 // TECHNICAL SPECIFICATIONS
            </h3>
            
            <div className="flex flex-wrap gap-4 mb-16">
              {mission.tech.map((t) => (
                <div 
                  key={t} 
                  className="px-6 py-4 border border-white/10 bg-white/5 backdrop-blur-md text-white font-mono text-sm tracking-widest hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  {t}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              {Object.entries(mission.metrics).map(([key, value], i) => (
                <div key={key} className="bg-black p-8">
                  <div 
                    className="font-display text-4xl md:text-6xl font-black mb-4"
                    style={{ color: mission.color }}
                  >
                    {value}
                  </div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-[0.2em]">
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}