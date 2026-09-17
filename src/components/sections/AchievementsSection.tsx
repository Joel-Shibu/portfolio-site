"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const achievements = [
  { 
    title: "NEURAL LINK", 
    subtitle: "ESTABLISHED", 
    desc: "Browser ML Pioneer",
    color: "#00FF88",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2500&auto=format&fit=crop"
  },
  { 
    title: "PRIVACY", 
    subtitle: "GUARDIAN", 
    desc: "On-device Processing",
    color: "#00D4FF",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2500&auto=format&fit=crop"
  },
  { 
    title: "REAL-TIME", 
    subtitle: "RESPONDER", 
    desc: "WebSocket Architecture",
    color: "#FFD700",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2500&auto=format&fit=crop"
  }
];

export default function AchievementsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.achievement-card');
    
    (cards as HTMLElement[]).forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-black overflow-hidden py-32 flex flex-col items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="font-mono text-sm tracking-[0.4em] text-white/50 mb-6 uppercase">
            [ CERTIFIED RECORDS ]
          </p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-[6rem] font-black text-white tracking-tighter leading-none">
            ACCOLADES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="achievement-card group relative w-full aspect-[3/4] overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
            >
              {/* Background Image Container */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={achievement.image} 
                  alt={achievement.title}
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end mix-blend-exclusion">
                <p className="font-mono text-sm tracking-[0.3em] mb-4" style={{ color: achievement.color }}>
                  [ {String(index + 1).padStart(2, '0')} ]
                </p>
                <h3 className="font-display text-4xl font-black leading-tight text-white uppercase mb-2 tracking-tighter">
                  {achievement.title}
                </h3>
                <h4 className="font-display text-2xl font-bold text-white/70 uppercase mb-4 tracking-tight">
                  {achievement.subtitle}
                </h4>
                <p className="font-mono text-sm text-white/80">
                  {achievement.desc}
                </p>
              </div>

              <div className="absolute top-8 right-8 shrink-0 w-16 h-16 rounded-full border border-white/20 items-center justify-center flex overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-white/5" />
                <div 
                  className="absolute inset-0 border-t-2 border-transparent rounded-full animate-spin"
                  style={{ borderTopColor: achievement.color, animationDuration: '3s' }}
                />
                <span className="text-xl">🏆</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}