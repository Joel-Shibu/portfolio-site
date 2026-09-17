"use client";

import { useEffect } from "react";
import { registerGSAP } from "@/lib/animations/gsap-setup";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import { RobotScrollytelling } from "@/components/robot/RobotScrollytelling";
import SkillsSection from "@/components/sections/SkillsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  useEffect(() => {
    registerGSAP();
  }, []);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Floating Modern Frosted Glass Navigation Bar */}
      <Navbar />

      {/* Modern White Architectural Hero */}
      <HeroSection />

      {/* Centerpiece: Pinned 3D Robot Swiping Scrollytelling Showcase */}
      <RobotScrollytelling />

      {/* Technical Arsenal / Capabilities Bento Grid */}
      <SkillsSection />

      {/* Biographical Dossier & Engineering Accreditations */}
      <AboutSection />

      {/* Direct Transmission & Comms Center */}
      <ContactSection />
    </main>
  );
}