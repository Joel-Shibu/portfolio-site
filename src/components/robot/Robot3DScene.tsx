"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { RobotModel } from "./RobotModel";

interface Robot3DSceneProps {
  scrollProgress: number;
  className?: string;
}

interface CameraKeyframe {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}

const CINEMATIC_CAMERA_TRACK: CameraKeyframe[] = [
  // 0: Hero Init Frontal Wide (p = 0.00 - 0.15)
  {
    pos: [0.0, 0.6, 3.4],
    target: [0.0, 0.55, 0.0],
    fov: 36.0,
  },
  // 1: NeuroSight OTS Right Orbit (p = 0.15 - 0.32)
  {
    pos: [1.65, 0.95, 2.3],
    target: [-0.4, 0.6, 0.0],
    fov: 40.0,
  },
  // 2: RESP-AI Low-Angle Heroic Orbit (p = 0.32 - 0.50)
  {
    pos: [-1.75, -0.25, 2.65],
    target: [0.45, 0.7, 0.0],
    fov: 44.0,
  },
  // 3: AirGuardian Tactical Drone Overhead (p = 0.50 - 0.68)
  {
    pos: [0.0, 2.75, 2.45],
    target: [0.0, 0.25, 0.0],
    fov: 48.0,
  },
  // 4: Technical Arsenal 3/4 CAD View (p = 0.68 - 0.85)
  {
    pos: [2.1, 0.75, 2.15],
    target: [-0.35, 0.45, 0.0],
    fov: 38.0,
  },
  // 5: Contact Comms Frontal Intimate Framing (p = 0.85 - 1.00)
  {
    pos: [0.0, 0.55, 2.8],
    target: [0.0, 0.5, 0.0],
    fov: 34.0,
  },
];

function CinematicCameraRig({ scrollProgress }: { scrollProgress: number }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0.55, 0));

  useFrame(({ camera }, delta) => {
    const totalSegments = CINEMATIC_CAMERA_TRACK.length - 1;
    const clampedP = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    const scaled = clampedP * totalSegments;
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const t = scaled - index;

    // Cubic smoothstep easing
    const smoothT = t * t * (3 - 2 * t);

    const k0 = CINEMATIC_CAMERA_TRACK[index];
    const k1 = CINEMATIC_CAMERA_TRACK[index + 1];

    // Check if mobile viewport
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const mobileZMultiplier = isMobile ? 1.35 : 1.0;
    const mobileFovBoost = isMobile ? 6 : 0;

    // Interpolate camera position and target
    const targetCamX = THREE.MathUtils.lerp(k0.pos[0], k1.pos[0], smoothT);
    const targetCamY = THREE.MathUtils.lerp(k0.pos[1], k1.pos[1], smoothT);
    const targetCamZ = THREE.MathUtils.lerp(k0.pos[2], k1.pos[2], smoothT) * mobileZMultiplier;

    const targetLookX = THREE.MathUtils.lerp(k0.target[0], k1.target[0], smoothT);
    const targetLookY = THREE.MathUtils.lerp(k0.target[1], k1.target[1], smoothT);
    const targetLookZ = THREE.MathUtils.lerp(k0.target[2], k1.target[2], smoothT);

    const targetFov = THREE.MathUtils.lerp(k0.fov, k1.fov, smoothT) + mobileFovBoost;

    // Dampen camera motion smoothly
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.2, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookX, 4.8, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookY, 4.8, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookZ, 4.8, delta);
    camera.lookAt(currentLookAt.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 3.8, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export function Robot3DScene({ scrollProgress, className = "" }: Robot3DSceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`relative w-full h-full pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0.6, 3.4], fov: 36 }}
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
          <CinematicCameraRig scrollProgress={scrollProgress} />

          {/* Studio Key & Rim Lighting */}
          <ambientLight intensity={1.5} />
          
          {/* Main Key Light */}
          <directionalLight
            position={[-4, 8, 6]}
            intensity={2.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* Specular White Fill Light */}
          <directionalLight
            position={[6, 5, 4]}
            intensity={1.8}
            color="#FFFFFF"
          />

          {/* Ice-Blue Rim Backlight */}
          <directionalLight
            position={[0, -2, -4]}
            intensity={1.4}
            color="#0EA5E9"
          />

          {/* Floating Robot Actor */}
          <Float
            speed={2}
            rotationIntensity={0.15}
            floatIntensity={0.2}
            floatingRange={[-0.04, 0.04]}
          >
            <RobotModel
              scrollProgress={scrollProgress}
              mousePosition={mousePos}
            />
          </Float>

          {/* Studio Contact Shadow */}
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={6}
            blur={2.4}
            far={4.5}
            color="#09090B"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
