"use client";

import { useEffect } from "react";
import { registerGSAP } from "@/lib/animations/gsap-setup";
import { RobotScrollytelling } from "@/components/robot/RobotScrollytelling";

export default function Home() {
  useEffect(() => {
    registerGSAP();
  }, []);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Unified Continuous 3D Robot Cinematic Scrollytelling Experience */}
      <RobotScrollytelling />
    </main>
  );
}