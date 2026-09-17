"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const missions = [
  {
    id: "neurosight",
    title: "NEUROSIGHT",
    subtitle: "Healthcare AI / Brain-Computer Interface",
    color: "#00FF88",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2500&auto=format&fit=crop",
    tech: ["TensorFlow.js", "React", "FastAPI"],
  },
  {
    id: "resp-ai",
    title: "RESP-AI",
    subtitle: "Real-Time Respiratory Monitoring",
    color: "#00D4FF",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2500&auto=format&fit=crop",
    tech: ["Flutter", "CNN", "Python"],
  },
  {
    id: "airguardian",
    title: "AIRGUARDIAN",
    subtitle: "Autonomous Drone Systems",
    color: "#FF6B35",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=2500&auto=format&fit=crop",
    tech: ["Python", "OpenCV", "INAV"],
  }
];

export default function MissionSelect({ onMissionSelect }: { onMissionSelect?: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const panels = panelsRef.current;
    
    // Horizontal scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${window.innerWidth * missions.length}`,
        pin: true,
        scrub: 1, // Smooth scrubbing
        anticipatePin: 1,
      }
    });

    tl.to(scrollWrapperRef.current, {
      x: () => -(window.innerWidth * (missions.length - 1)),
      ease: "none"
    }, 0);

    // Animate individual elements inside panels during scroll
    panels.forEach((panel, i) => {
      if (!panel) return;
      const image = panel.querySelector('.mission-image');
      
      // Image parallax effect tied to the same timeline
      tl.to(image, {
        xPercent: 30,
        ease: "none"
      }, 0);
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="missions"
      className="relative w-screen h-screen bg-black overflow-hidden"
    >
      {/* Introduction text floating above */}
      <div className="absolute top-12 left-12 z-20 mix-blend-difference pointer-events-none hidden md:block">
        <h2 className="font-mono text-2xl tracking-[0.2em] text-white">MISSIONS ARCHIVE</h2>
        <div className="w-16 h-px bg-white mt-4" />
      </div>

      <div 
        ref={scrollWrapperRef}
        className="flex w-[300vw] h-full"
      >
        {missions.map((mission, index) => (
          <div 
            key={mission.id}
            ref={(el) => { panelsRef.current[index] = el; }}
            className="relative w-screen h-full flex-shrink-0 flex items-center justify-center overflow-hidden"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
              {/* Parallax Image */}
              <div className="mission-image absolute inset-[-25%] w-[150%] h-[150%]">
                <img 
                  src={mission.image} 
                  alt={mission.title}
                  className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-[2000ms]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/90 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
            </div>

            {/* Content */}
            <div className="mission-content relative z-10 w-full max-w-7xl px-8 flex flex-col md:flex-row items-center justify-between">
              
              <div className="text-left max-w-3xl mix-blend-exclusion mb-8 md:mb-0">
                <p className="font-mono text-lg tracking-[0.3em] mb-4" style={{ color: mission.color }}>
                  [ 0{index + 1} {"//"} {mission.id.toUpperCase()} ]
                </p>
                <h3 className="font-display text-[8vw] md:text-[6vw] font-black leading-[0.85] text-white uppercase mb-6 tracking-tighter">
                  {mission.title}
                </h3>
                <p className="font-mono text-xl text-white/80 max-w-xl">
                  {mission.subtitle}
                </p>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  {mission.tech.map((t) => (
                    <span 
                      key={t}
                      className="font-mono text-xs px-4 py-2 border border-white/20 text-white/70 tracking-widest backdrop-blur-sm bg-black/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative group shrink-0 mt-12 md:mt-0">
                <button 
                  onClick={() => onMissionSelect?.(mission.id)}
                  className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-white/80"
                  style={{ color: mission.color }}
                >
                  <span className="font-mono text-xs tracking-widest relative z-10 text-white group-hover:text-black transition-colors delay-100">
                    ENTER
                  </span>
                  <div 
                    className="absolute inset-0 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                    style={{ backgroundColor: mission.color }}
                  />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}