"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, HeartPulse, Cpu, Layers, Sparkles, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    icon: Bot,
    tag: "CAPABILITY 01",
    title: "Agentic AI & Orchestration",
    description: "Designing autonomous multi-agent systems, deterministic tool-calling pipelines, and context-aware LLM orchestration frameworks.",
    skills: ["Multi-Agent Architectures", "Prompt Engineering", "Tool Use & Function Calling", "LangChain & Custom Agents", "Context Optimization"],
  },
  {
    icon: HeartPulse,
    tag: "CAPABILITY 02",
    title: "Healthcare ML & Edge AI",
    description: "Architecting privacy-first deep learning models running client-side with sub-50ms latency and zero telemetry leakage.",
    skills: ["TensorFlow.js Edge Inference", "CNN Acoustic & Vision Models", "Biometric Gaze Tracking", "WebAssembly Acceleration", "Privacy-Preserving AI"],
  },
  {
    icon: Cpu,
    tag: "CAPABILITY 03",
    title: "Autonomous Robotics & SLAM",
    description: "Integrating hardware sensors, motor controllers, and real-time computer vision for obstacle avoidance and spatial mapping.",
    skills: ["Robot Operating System (ROS)", "OpenCV Spatial Vision", "ESP32 & Microcontroller C++", "INAV Flight Telemetry", "8-Sensor Fusion Arrays"],
  },
  {
    icon: Layers,
    tag: "CAPABILITY 04",
    title: "Production Infrastructure",
    description: "Deploying production-grade machine learning microservices, reactive frontend architectures, and resilient pipelines.",
    skills: ["Next.js 16 (Turbopack, React 19)", "FastAPI Asynchronous Microservices", "Docker Containerization", "Google Cloud Platform (GCP)", "Low-Latency WebSockets"],
  },
];

export default function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!titleRef.current || !gridRef.current) return;

    gsap.from(titleRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
      },
    });

    const cards = gridRef.current.children;
    gsap.from(cards, {
      opacity: 0,
      y: 35,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 75%",
      },
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      id="skills" 
      className="relative w-full py-32 px-6 md:px-12 bg-[#FAFBFD] border-t border-b border-neutral-200/60"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="max-w-2xl mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-xs font-mono text-neutral-600 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>CORE ENGINEERING DOMAIN</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 mb-4">
            Technical Arsenal
          </h2>
          <p className="text-neutral-500 text-base md:text-lg leading-relaxed">
            Bridging theoretical artificial intelligence, edge deep learning, and mechanical robotics to construct self-sufficient intelligent systems.
          </p>
        </div>

        {/* 4-Card Architectural Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CAPABILITIES.map((cap, idx) => {
            const IconComponent = cap.icon;
            return (
              <div 
                key={idx}
                className="group relative p-8 md:p-10 rounded-3xl bg-white border border-neutral-200/80 shadow-clean hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Icon and Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-400 tracking-wider">
                      {cap.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                    {cap.description}
                  </p>
                </div>

                {/* Skills Bullet List */}
                <div className="space-y-2.5 pt-6 border-t border-neutral-100">
                  {cap.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-center space-x-2.5 text-xs text-neutral-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Production Stack Badges */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-clean flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
              RUNTIME & CLOUD ECOSYSTEM
            </div>
            <div className="text-lg font-bold text-neutral-900">
              Verified Production Toolchain
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              "PyTorch",
              "TensorFlow",
              "Next.js",
              "FastAPI",
              "ROS",
              "Docker",
              "Google Cloud",
              "ESP32 C++",
              "WebSockets",
              "OpenCV",
            ].map((tech) => (
              <span 
                key={tech} 
                className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-xs font-mono font-medium text-neutral-700 transition-colors duration-200 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}