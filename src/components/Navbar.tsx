"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
      <nav 
        className={`flex items-center justify-between w-full max-w-6xl px-5 py-3 rounded-full transition-all duration-300 pointer-events-auto ${
          scrolled 
            ? "glass-panel shadow-clean border border-neutral-200/80 bg-white/85" 
            : "bg-white/60 backdrop-blur-sm border border-neutral-200/40"
        }`}
      >
        {/* Brand / Name Monogram */}
        <button 
          onClick={() => scrollTo("hero")}
          className="flex items-center space-x-2 text-left group"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs group-hover:scale-105 transition-transform">
            JS
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-neutral-900 leading-none">
              JOEL SHIBU
            </div>
            <div className="font-mono text-[9px] text-neutral-400 tracking-wider uppercase mt-0.5">
              AI & ROBOTICS
            </div>
          </div>
        </button>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-7 text-xs font-medium text-neutral-600">
          <button 
            onClick={() => scrollTo("hero")} 
            className="hover:text-neutral-900 transition-colors"
          >
            Overview
          </button>
          <button 
            onClick={() => scrollTo("missions")} 
            className="hover:text-neutral-900 transition-colors flex items-center space-x-1"
          >
            <span>3D Showcase</span>
            <span className="text-[9px] font-mono bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded">KINETIC</span>
          </button>
          <button 
            onClick={() => scrollTo("skills")} 
            className="hover:text-neutral-900 transition-colors"
          >
            Capabilities
          </button>
          <button 
            onClick={() => scrollTo("about")} 
            className="hover:text-neutral-900 transition-colors"
          >
            Dossier
          </button>
          <button 
            onClick={() => scrollTo("contact")} 
            className="hover:text-neutral-900 transition-colors"
          >
            Connect
          </button>
        </div>

        {/* Right Status Badge / CTA */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/60 text-[11px] font-mono text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AVAILABLE</span>
          </div>

          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide transition-all duration-200 hover:scale-[1.02]"
          >
            <span>Initiate Link</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
