"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Copy, Check, ArrowUpRight, Sparkles } from "lucide-react";

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

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const email = "joelshibuadoor@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.from(contentRef.current, {
      opacity: 0,
      y: 40,
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
      id="contact" 
      className="relative w-full py-32 px-6 md:px-12 bg-white border-t border-neutral-100 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Section Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-xs font-mono text-neutral-600 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>NEURAL TRANSMISSION & COMMS</span>
        </div>

        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 mb-6">
          Initiate Contact
        </h2>

        <p className="text-neutral-500 text-base md:text-lg max-w-xl mx-auto mb-16 leading-relaxed">
          Open for engineering roles, autonomous robotics collaboration, and AI systems architecture dialogues.
        </p>

        {/* 3 Porcelain Transmission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          
          {/* Email Card */}
          <div className="group relative p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/80 shadow-clean hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center text-neutral-900 mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
              DIRECT INBOX
            </div>
            <div className="text-lg font-bold text-neutral-900 mb-4">
              Email Channel
            </div>
            <div className="flex items-center space-x-2 w-full mt-auto">
              <a 
                href={`mailto:${email}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Write Mail</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <button 
                onClick={handleCopy}
                className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
                title="Copy Email to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="group relative p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/80 shadow-clean hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center text-neutral-900 mb-6 group-hover:scale-110 transition-transform">
              <LinkedInIcon className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
              PROFESSIONAL NETWORK
            </div>
            <div className="text-lg font-bold text-neutral-900 mb-4">
              LinkedIn
            </div>
            <a 
              href="https://linkedin.com/in/joel-shibu-b6bb54352" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full mt-auto py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Connect Profile</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* GitHub Card */}
          <div className="group relative p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/80 shadow-clean hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center text-neutral-900 mb-6 group-hover:scale-110 transition-transform">
              <GitHubIcon className="w-5 h-5 text-neutral-900" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
              SOURCE ARCHIVE
            </div>
            <div className="text-lg font-bold text-neutral-900 mb-4">
              GitHub
            </div>
            <a 
              href="https://github.com/Joel-Shibu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full mt-auto py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Explore Code</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Transmission Standby Telemetry Bar */}
        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-600 mb-16">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYSTEM ACTIVE // READY TO RECEIVE TRANSMISSIONS</span>
        </div>

        {/* Minimalist Architectural Footer */}
        <footer className="pt-12 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} JOEL SHIBU. ALL ARCHITECTURES RESERVED.
          </div>
          <div>
            ENGINEERED WITH REACT 19 & THREE.JS
          </div>
        </footer>
      </div>
    </section>
  );
}