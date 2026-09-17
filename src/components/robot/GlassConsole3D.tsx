"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlassConsole3DProps {
  scrollProgress?: number; // 0.0 to 1.0
  touchPoint?: { x: number; y: number; z?: number; active: boolean; intensity: number };
}

export function GlassConsole3D({ scrollProgress = 0, touchPoint }: GlassConsole3DProps) {
  const consoleGroupRef = useRef<THREE.Group>(null);
  const touchGlowRef = useRef<THREE.Mesh>(null);
  const touchLightRef = useRef<THREE.PointLight>(null);
  const rippleMeshRef = useRef<THREE.Mesh>(null);

  // High-fidelity physical glass material with transmission
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F8FAFC"),
      transmission: 0.90,
      opacity: 0.88,
      transparent: true,
      roughness: 0.05,
      metalness: 0.04,
      ior: 1.52,
      thickness: 0.06,
      specularIntensity: 1.0,
      specularColor: new THREE.Color("#FFFFFF"),
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      side: THREE.DoubleSide,
    });
  }, []);

  // Frame edge material (brushed titanium)
  const frameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2E8F0"),
      metalness: 0.88,
      roughness: 0.18,
    });
  }, []);

  // Curved glass geometry: cylinder slice matching R=2.4m
  const glassGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(
      2.4,   // radiusTop
      2.4,   // radiusBottom
      1.35,  // height
      48,    // radialSegments
      8,     // heightSegments
      true,  // openEnded
      Math.PI * 0.74,  // thetaStart
      Math.PI * 0.52   // thetaLength
    );
    return geom;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (consoleGroupRef.current) {
      // Subtle ambient hover with responsive scroll tilt
      consoleGroupRef.current.position.y = -0.12 + Math.sin(time * 1.4) * 0.012;
      consoleGroupRef.current.rotation.x = scrollProgress * 0.035;
    }

    // Dynamic capacitive touch glow on the curved 3D glass
    if (touchGlowRef.current && touchLightRef.current && rippleMeshRef.current) {
      if (touchPoint && touchPoint.active) {
        touchGlowRef.current.visible = true;
        touchLightRef.current.visible = true;
        rippleMeshRef.current.visible = true;

        const targetZ = touchPoint.z ?? 0.52;

        touchGlowRef.current.position.set(touchPoint.x, touchPoint.y, targetZ + 0.015);
        touchLightRef.current.position.set(touchPoint.x, touchPoint.y, targetZ + 0.04);
        rippleMeshRef.current.position.set(touchPoint.x, touchPoint.y, targetZ + 0.012);

        // Dynamic pulse ripple
        const rippleScale = 1.0 + Math.sin(time * 9.0) * 0.28;
        rippleMeshRef.current.scale.set(rippleScale, rippleScale, 1.0);
        touchLightRef.current.intensity = 1.8 * touchPoint.intensity;
      } else {
        touchGlowRef.current.visible = false;
        touchLightRef.current.visible = false;
        rippleMeshRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      {/* Curved Transparent Glass Console Group */}
      <group ref={consoleGroupRef} position={[0, -0.12, 0.27]}>
        {/* Curved Glass Holographic Screen */}
        <mesh
          geometry={glassGeometry}
          material={glassMaterial}
          position={[0, 0.85, -2.15]}
        >
          {/* Subtle top frame edge */}
          <mesh position={[0, 0.68, 0]} material={frameMaterial}>
            <boxGeometry args={[2.3, 0.018, 0.03]} />
          </mesh>
          {/* Subtle bottom frame edge */}
          <mesh position={[0, -0.68, 0]} material={frameMaterial}>
            <boxGeometry args={[2.3, 0.018, 0.03]} />
          </mesh>
        </mesh>

        {/* Console Pedestal Base */}
        <group position={[0, -0.65, 0.65]}>
          <mesh material={frameMaterial}>
            <cylinderGeometry args={[0.55, 0.70, 0.12, 32]} />
          </mesh>
          <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.50, 0.53, 32]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
          </mesh>
        </group>
      </group>

      {/* World-Space Capacitive Touch Light & Ripple Elements (Directly on Finger Contact) */}
      <group>
        {/* Dynamic touch glow point */}
        <mesh ref={touchGlowRef} visible={false}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.88} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Concentric touch ripple */}
        <mesh ref={rippleMeshRef} visible={false}>
          <ringGeometry args={[0.065, 0.082, 32]} />
          <meshBasicMaterial color="#0EA5E9" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {/* Dynamic contact point light */}
        <pointLight ref={touchLightRef} color="#38BDF8" distance={0.7} intensity={1.8} visible={false} />
      </group>
    </group>
  );
}
