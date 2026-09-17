"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { RobotModel } from "./RobotModel";

interface Robot3DSceneProps {
  scrollProgress: number;
  swipePhase: number;
  className?: string;
}

export function Robot3DScene({ scrollProgress, swipePhase, className = "" }: Robot3DSceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0.4, 4.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
        style={{ pointerEvents: "auto" }}
      >
        <Suspense fallback={null}>
          {/* Studio Key and Rim Lighting */}
          <ambientLight intensity={1.4} />
          
          {/* Main Top-Left Soft Studio Key Light */}
          <directionalLight
            position={[-4, 7, 5]}
            intensity={2.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* Right Specular Fill Light */}
          <directionalLight
            position={[5, 4, 3]}
            intensity={1.6}
            color="#FFFFFF"
          />

          {/* Subtle Ice-Blue Rim Backlight */}
          <directionalLight
            position={[0, -2, -4]}
            intensity={1.2}
            color="#0EA5E9"
          />

          {/* Floating Levitation Physics */}
          <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.25}
            floatingRange={[-0.05, 0.05]}
          >
            <RobotModel
              scrollProgress={scrollProgress}
              swipePhase={swipePhase}
              mousePosition={mousePos}
            />
          </Float>

          {/* Realistic Studio Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={5}
            blur={2.4}
            far={4}
            color="#09090B"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
