"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RobotModel, TouchPointData } from "./RobotModel";
import { GlassConsole3D } from "./GlassConsole3D";

interface Robot3DSceneProps {
  scrollProgress: number; // 0.0 to 1.0
  className?: string;
}

// Documentary-style Over-The-Shoulder (OTS) & Robot POV Camera Path
// Camera stays grounded within the robot's immediate workspace
const POV_CAMERA_PATH = [
  // 0: Intimate Right-OTS Hero Framing (Looking past right shoulder at glass)
  {
    pos: new THREE.Vector3(0.48, 0.98, 1.75),
    lookAt: new THREE.Vector3(0.12, 0.75, 0.52),
    fov: 40,
  },
  // 1: Right-OTS Tracking Right-Arm Leftward Swipe
  {
    pos: new THREE.Vector3(0.55, 1.02, 1.68),
    lookAt: new THREE.Vector3(-0.05, 0.74, 0.52),
    fov: 42,
  },
  // 2: Left-OTS Tracking Left-Arm Rightward Swipe
  {
    pos: new THREE.Vector3(-0.55, 1.02, 1.68),
    lookAt: new THREE.Vector3(0.05, 0.74, 0.52),
    fov: 42,
  },
  // 3: Right-OTS Framing Left-Arm Pointing at AirGuardian (Left Panel)
  {
    pos: new THREE.Vector3(0.36, 1.02, 1.72),
    lookAt: new THREE.Vector3(-0.18, 0.76, 0.50),
    fov: 42,
  },
  // 4: Left-OTS Framing Right-Arm Pointing at Engineering Stack (Right Panel)
  {
    pos: new THREE.Vector3(-0.36, 1.02, 1.72),
    lookAt: new THREE.Vector3(0.18, 0.76, 0.50),
    fov: 42,
  },
  // 5: Frontal Eye-Level Through-The-Glass Terminal
  {
    pos: new THREE.Vector3(0.0, 0.92, 2.05),
    lookAt: new THREE.Vector3(0.0, 0.78, 0.52),
    fov: 38,
  },
];

function RobotPOVCameraRig({ scrollProgress }: { scrollProgress: number }) {
  const currentLookAt = useRef(new THREE.Vector3(0.12, 0.75, 0.52));
  const scratchTargetPos = useRef(new THREE.Vector3());
  const scratchTargetLook = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const p = Math.max(0, Math.min(1, scrollProgress));
    const cam = state.camera;
    const time = state.clock.getElapsedTime();

    // Determine current camera segment
    const nSegments = POV_CAMERA_PATH.length - 1;
    const scaledP = p * nSegments;
    const segmentIndex = Math.min(nSegments - 1, Math.floor(scaledP));
    const segmentT = scaledP - segmentIndex;

    // Hermite smoothstep easing for smooth cinematic velocity
    const easeT = segmentT * segmentT * (3.0 - 2.0 * segmentT);

    const from = POV_CAMERA_PATH[segmentIndex];
    const to = POV_CAMERA_PATH[segmentIndex + 1];

    scratchTargetPos.current.lerpVectors(from.pos, to.pos, easeT);
    scratchTargetLook.current.lerpVectors(from.lookAt, to.lookAt, easeT);
    const targetFov = THREE.MathUtils.lerp(from.fov, to.fov, easeT);

    // Subtle natural handheld/Steadicam breathing drift
    const driftX = Math.sin(time * 0.9) * 0.003;
    const driftY = Math.cos(time * 0.7) * 0.0025;
    scratchTargetPos.current.x += driftX;
    scratchTargetPos.current.y += driftY;

    // Responsive adaptation based on aspect ratio & screen width
    // Ensures robot stays proportionally framed on phones, foldables, tablets, and ultra-wide screens
    const aspect = state.viewport.aspect;
    if (aspect < 1.0) {
      // Mobile portrait (e.g. 9:16 / 9:19.5): smooth pullback based on narrowness
      const portraitPullback = (1.0 - aspect) * 1.15;
      scratchTargetPos.current.z += 0.55 + portraitPullback;
      scratchTargetPos.current.y += 0.08;
      scratchTargetLook.current.y += 0.03;
    } else if (aspect < 1.35) {
      // Tablet portrait / iPad / Square foldables:
      scratchTargetPos.current.z += 0.28;
    }

    // Critically damped camera tracking (smooth, no abrupt snapping)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, scratchTargetPos.current.x, 8, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, scratchTargetPos.current.y, 8, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, scratchTargetPos.current.z, 8, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, scratchTargetLook.current.x, 8, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, scratchTargetLook.current.y, 8, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, scratchTargetLook.current.z, 8, delta);

    if (cam instanceof THREE.PerspectiveCamera) {
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 6, delta);
      cam.updateProjectionMatrix();
    }

    cam.lookAt(currentLookAt.current);
  });

  return null;
}

export function Robot3DScene({ scrollProgress, className = "" }: Robot3DSceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [touchPoint, setTouchPoint] = useState<TouchPointData>({
    x: 0,
    y: 0,
    z: 0.6,
    active: false,
    intensity: 0,
  });

  useEffect(() => {
    // Only listen for mousemove if pointer is fine (desktop/laptop)
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.8]} // Clamps DPR between 1 and 1.8 to prevent mobile GPU throttling
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0.42, 0.95, 1.45], fov: 40 }}
        className="w-full h-full"
      >
        {/* Soft Ambient Studio Illumination */}
        <ambientLight intensity={1.3} />
        
        {/* Key Light: High softbox overhead casting soft grounding shadow */}
        <directionalLight
          position={[2.5, 4.5, 3.0]}
          intensity={1.9}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={10}
          shadow-camera-left={-2.5}
          shadow-camera-right={2.5}
          shadow-camera-top={2.5}
          shadow-camera-bottom={-2.5}
        />

        {/* Rim Light: Cool titanium edge definition */}
        <directionalLight position={[-2.5, 3.5, -1.5]} intensity={1.4} color="#E0F2FE" />
        
        {/* Fill Light: Soft white studio bounce */}
        <directionalLight position={[0, -2, 2]} intensity={0.6} color="#FFFFFF" />

        {/* Dynamic Screen Bounce Light (illuminates robot fingers and wrist on contact) */}
        {touchPoint.active && (
          <pointLight
            position={[touchPoint.x, touchPoint.y, touchPoint.z + 0.08]}
            color="#38BDF8"
            intensity={2.2 * touchPoint.intensity}
            distance={0.9}
            decay={2}
          />
        )}

        {/* Realistic Over-The-Shoulder / Robot POV Camera Rig */}
        <RobotPOVCameraRig scrollProgress={scrollProgress} />

        {/* The Central Dynamic 3D Humanoid Robot */}
        <RobotModel
          scrollProgress={scrollProgress}
          mousePosition={mousePos}
          onTouchPointChange={setTouchPoint}
        />

        {/* Curved 3D Transparent Glass Holographic Console */}
        <GlassConsole3D
          scrollProgress={scrollProgress}
          touchPoint={touchPoint}
        />

        {/* Studio Floor with Soft Grounding Contact Shadow */}
        <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
      </Canvas>
    </div>
  );
}
