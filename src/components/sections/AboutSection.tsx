"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, GraduationCap, MapPin, Sparkles, UserCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CERTIFICATIONS = [
  { title: "Google Cloud — Prompt Design", issuer: "Google", icon: Award },
  { title: "Robotics & Dynamic Controls", issuer: "Johnson & Johnson", icon: Award },
  { title: "Software Engineering Simulation", issuer: "Electronic Arts", icon: Award },
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!leftColRef.current || !rightColRef.current) return;

    gsap.from(leftColRef.current, {
      opacity: 0,
      x: -40,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
    });

    gsap.from(rightColRef.current, {
      opacity: 0,
      x: 40,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      id="about" 
      className="relative w-full py-32 px-6 md:px-12 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Dossier Biography */}
          <div ref={leftColRef} className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-xs font-mono text-neutral-600 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>BIOGRAPHICAL DOSSIER</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 mb-6 leading-tight">
              Engineering the Next Epoch of Intelligent Autonomy
            </h2>

            <div className="space-y-4 text-neutral-600 text-base md:text-lg leading-relaxed mb-10">
              <p>
                I am an AI Systems Engineer and 3rd-year engineering scholar at <strong>APJ Abdul Kalam Technological University</strong> in Kerala, India. My work focuses on synthesizing mathematical deep learning foundations with deterministic robotic hardware controls.
              </p>
              <p>
                Rather than treating AI as an isolated black box, I design end-to-end architectures: from low-latency on-device inference using WebAssembly and edge CNNs, to real-time SLAM algorithms navigating physical environments on autonomous UAVs.
              </p>
            </div>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-neutral-100">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-neutral-400 uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Base</span>
                </div>
                <div className="text-sm font-bold text-neutral-900">
                  Kerala, India
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-neutral-400 uppercase mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Education</span>
                </div>
                <div className="text-sm font-bold text-neutral-900">
                  APJ Abdul Kalam Univ
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-neutral-400 uppercase mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Availability</span>
                </div>
                <div className="text-sm font-bold text-emerald-600">
                  Open for AI Roles
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Credential & Certifications */}
          <div ref={rightColRef} className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-neutral-50/80 border border-neutral-200/80 shadow-clean">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                  VERIFIED ACCREDITATION
                </h3>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>

              <div className="space-y-4">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-neutral-200/60 shadow-sm flex items-start space-x-3.5 hover:border-neutral-300 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <cert.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        {cert.title}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        Issued by {cert.issuer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Pillars Bento Card */}
            <div className="p-8 rounded-3xl bg-neutral-900 text-white shadow-float relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
                  ENGINEERING PHILOSOPHY
                </div>
                <blockquote className="text-lg font-medium leading-snug mb-4">
                  &ldquo;True machine intelligence is measured not by parameter count, but by responsiveness, autonomy, and privacy in the physical world.&rdquo;
                </blockquote>
                <div className="text-xs font-mono text-neutral-400">
                  — Joel Shibu {"//"} Core Directive
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}