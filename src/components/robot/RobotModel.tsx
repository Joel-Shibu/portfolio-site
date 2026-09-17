"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RobotModelProps {
  scrollProgress: number; // 0 to 1
  swipePhase: number;     // 0: Hero, 1: NeuroSight, 2: RESP-AI, 3: AirGuardian, 4: Skills, 5: Contact
  mousePosition?: { x: number; y: number };
}

export function RobotModel({ scrollProgress, swipePhase, mousePosition = { x: 0, y: 0 } }: RobotModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const torsoGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const swipeTrailRef = useRef<THREE.Mesh>(null);

  // High-end PBR Ceramic and Chrome Materials
  const materials = useMemo(() => {
    const whiteCeramic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F8F9FA"),
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });

    const polishedChrome = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2E8F0"),
      roughness: 0.1,
      metalness: 0.96,
    });

    const darkCarbon = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#18181B"),
      roughness: 0.35,
      metalness: 0.7,
    });

    const obsidianVisor = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#050508"),
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const iceGlow = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00B4D8"),
    });

    const cyanNeon = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#0EA5E9"),
    });

    return {
      whiteCeramic,
      polishedChrome,
      darkCarbon,
      obsidianVisor,
      iceGlow,
      cyanNeon,
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Natural Breathing & Floating Movement
    const floatY = Math.sin(time * 1.8) * 0.06;
    const idleTiltX = Math.sin(time * 0.9) * 0.02;
    const idleTiltZ = Math.cos(time * 1.2) * 0.015;

    if (rootGroupRef.current) {
      // Dynamic base positioning depending on scroll phase
      let targetX = 0;
      let targetY = floatY;
      let targetZ = 0;
      let targetRotY = 0;

      if (swipePhase === 0) {
        // Hero: Centered and elevated
        targetX = 0;
        targetY = floatY;
        targetZ = 0;
        targetRotY = 0;
      } else if (swipePhase === 1) {
        // NeuroSight: Robot positioned on right, angled towards the left project card
        targetX = 1.4;
        targetY = floatY - 0.1;
        targetZ = 0.2;
        targetRotY = -0.35;
      } else if (swipePhase === 2) {
        // RESP-AI: Robot positioned on left, angled towards the right project card
        targetX = -1.4;
        targetY = floatY - 0.1;
        targetZ = 0.2;
        targetRotY = 0.35;
      } else if (swipePhase === 3) {
        // AirGuardian: Centered slightly pushed back in commanding stance
        targetX = 0;
        targetY = floatY - 0.15;
        targetZ = -0.3;
        targetRotY = Math.sin(time * 0.5) * 0.08;
      } else {
        // Skills / Contact: Poised center
        targetX = 0;
        targetY = floatY;
        targetZ = 0;
        targetRotY = 0;
      }

      rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, targetX, delta * 3.5);
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, targetY, delta * 4);
      rootGroupRef.current.position.z = THREE.MathUtils.lerp(rootGroupRef.current.position.z, targetZ, delta * 3.5);
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, delta * 4);
      rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(rootGroupRef.current.rotation.z, idleTiltZ, delta * 4);
    }

    // 2. Head Tracking (Tracks mouse cursor + looking towards active project cards)
    if (headGroupRef.current) {
      let lookTargetX = mousePosition.x * 0.4;
      const lookTargetY = -mousePosition.y * 0.3;

      if (swipePhase === 1) {
        lookTargetX -= 0.3; // Look left towards NeuroSight
      } else if (swipePhase === 2) {
        lookTargetX += 0.3; // Look right towards RESP-AI
      }

      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, lookTargetX, delta * 5);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, lookTargetY + idleTiltX, delta * 5);
    }

    // 3. Cinematic Arm Kinematics & Swipe Gestures
    if (rightArmGroupRef.current && rightForearmRef.current && rightHandRef.current) {
      let rArmRotX = 0;
      let rArmRotY = 0;
      let rArmRotZ = -0.2; // Resting slight outward flair
      let rForearmRotX = 0.2;
      let rHandRotY = 0;

      if (swipePhase === 0) {
        // Resting posture with subtle micro-movements
        rArmRotX = Math.sin(time * 1.5) * 0.05;
        rArmRotZ = -0.22 + Math.cos(time * 1.2) * 0.03;
        rForearmRotX = 0.3;
      } else if (swipePhase === 1) {
        // SWIPE 1: Right arm sweeps horizontally across camera plane from right to left
        const swipeFactor = Math.sin(scrollProgress * Math.PI * 4);
        rArmRotX = -0.6 + swipeFactor * 0.2;
        rArmRotY = -0.8;
        rArmRotZ = -0.6;
        rForearmRotX = 0.9;
        rHandRotY = -0.4;
      } else if (swipePhase === 3) {
        // Both arms extending forward for AirGuardian
        rArmRotX = -0.8;
        rArmRotY = -0.3;
        rArmRotZ = -0.3;
        rForearmRotX = 0.5;
      } else if (swipePhase >= 4) {
        // Raised hands / Architectural gesture
        rArmRotX = -0.4;
        rArmRotZ = -0.45;
        rForearmRotX = 0.7;
      }

      rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, rArmRotX, delta * 4.5);
      rightArmGroupRef.current.rotation.y = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.y, rArmRotY, delta * 4.5);
      rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.z, rArmRotZ, delta * 4.5);
      rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, rForearmRotX, delta * 4.5);
      rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, rHandRotY, delta * 4.5);
    }

    if (leftArmGroupRef.current && leftForearmRef.current && leftHandRef.current) {
      let lArmRotX = 0;
      let lArmRotY = 0;
      let lArmRotZ = 0.2;
      let lForearmRotX = 0.2;

      if (swipePhase === 0) {
        lArmRotX = Math.cos(time * 1.5) * 0.05;
        lArmRotZ = 0.22 + Math.sin(time * 1.2) * 0.03;
        lForearmRotX = 0.3;
      } else if (swipePhase === 2) {
        // SWIPE 2: Left arm sweeps horizontally across from left to right
        lArmRotX = -0.6;
        lArmRotY = 0.8;
        lArmRotZ = 0.6;
        lForearmRotX = 0.9;
      } else if (swipePhase === 3) {
        lArmRotX = -0.8;
        lArmRotY = 0.3;
        lArmRotZ = 0.3;
        lForearmRotX = 0.5;
      } else if (swipePhase >= 4) {
        lArmRotX = -0.4;
        lArmRotZ = 0.45;
        lForearmRotX = 0.7;
      }

      leftArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.x, lArmRotX, delta * 4.5);
      leftArmGroupRef.current.rotation.y = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.y, lArmRotY, delta * 4.5);
      leftArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.z, lArmRotZ, delta * 4.5);
      leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, lForearmRotX, delta * 4.5);
    }

    // 4. Reactor Core Pulsing Light
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.2 + Math.sin(time * 3.5) * 0.5;
    }

    // 5. Swipe Arc Trail
    if (swipeTrailRef.current) {
      const isSwiping = swipePhase === 1 || swipePhase === 2;
      swipeTrailRef.current.visible = isSwiping;
      if (isSwiping) {
        swipeTrailRef.current.rotation.z = (time * 2) % (Math.PI * 2);
      }
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Dynamic Swipe Kinetic Energy Arc Ribbon */}
      <mesh ref={swipeTrailRef} visible={false} position={[0, 0.4, 0.5]}>
        <ringGeometry args={[1.2, 1.24, 64, 1, 0, Math.PI * 0.9]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* ========================================================
          TORSO / CHEST ASSEMBLY
      ======================================================== */}
      <group ref={torsoGroupRef} position={[0, 0, 0]}>
        {/* Main Upper Torso Ceramic Shell */}
        <mesh position={[0, 0.5, 0]} material={materials.whiteCeramic} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.8, 0.55]} />
        </mesh>

        {/* Slanted Aerodynamic Chest Armor Plates */}
        <mesh position={[0, 0.65, 0.22]} rotation={[0.2, 0, 0]} material={materials.whiteCeramic} castShadow>
          <boxGeometry args={[0.82, 0.45, 0.2]} />
        </mesh>

        {/* Back Spine & Thruster Radiator */}
        <mesh position={[0, 0.5, -0.28]} material={materials.darkCarbon}>
          <boxGeometry args={[0.3, 0.75, 0.15]} />
        </mesh>
        {[-0.15, 0, 0.15].map((yOffset, i) => (
          <mesh key={i} position={[0, 0.5 + yOffset, -0.36]} material={materials.polishedChrome}>
            <boxGeometry args={[0.22, 0.05, 0.08]} />
          </mesh>
        ))}

        {/* Central Luminous Reactor Core */}
        <mesh position={[0, 0.55, 0.32]} rotation={[Math.PI / 2, 0, 0]} material={materials.iceGlow}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
        </mesh>
        <mesh position={[0, 0.55, 0.31]} material={materials.polishedChrome}>
          <torusGeometry args={[0.12, 0.02, 16, 32]} />
        </mesh>
        <pointLight ref={coreLightRef} position={[0, 0.55, 0.45]} color="#00B4D8" intensity={1.5} distance={2.5} />

        {/* Lower Abdomen / Mechanical Spinal Segment */}
        <mesh position={[0, 0.02, 0]} material={materials.darkCarbon} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 0.32, 24]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.polishedChrome}>
          <torusGeometry args={[0.31, 0.03, 16, 32]} />
        </mesh>

        {/* Pelvis Floating Mecha Base */}
        <mesh position={[0, -0.25, 0]} material={materials.whiteCeramic} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.2, 0.3, 24]} />
        </mesh>
        {/* Bottom Stabilizer Thruster Ring */}
        <mesh position={[0, -0.4, 0]} material={materials.polishedChrome}>
          <cylinderGeometry args={[0.18, 0.24, 0.1, 32]} />
        </mesh>
        <mesh position={[0, -0.46, 0]} material={materials.cyanNeon}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        </mesh>
        <pointLight position={[0, -0.6, 0]} color="#0EA5E9" intensity={0.9} distance={1.8} />

        {/* ========================================================
            HEAD & VISOR ASSEMBLY
        ======================================================== */}
        <group ref={headGroupRef} position={[0, 1.05, 0.05]}>
          {/* Articulated Neck Servos */}
          <mesh position={[0, -0.12, -0.02]} material={materials.polishedChrome}>
            <cylinderGeometry args={[0.12, 0.14, 0.18, 20]} />
          </mesh>

          {/* Sculpted Helmet / Cranium */}
          <mesh position={[0, 0.08, -0.05]} material={materials.whiteCeramic} castShadow>
            <sphereGeometry args={[0.34, 32, 32]} />
          </mesh>

          {/* Temporal Ear Pods & Sensor Fins */}
          <mesh position={[-0.35, 0.08, -0.05]} rotation={[0, 0, Math.PI / 2]} material={materials.polishedChrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
          </mesh>
          <mesh position={[0.35, 0.08, -0.05]} rotation={[0, 0, Math.PI / 2]} material={materials.polishedChrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
          </mesh>

          {/* Aerodynamic Obsidian Visor */}
          <mesh position={[0, 0.08, 0.16]} rotation={[0.12, 0, 0]} material={materials.obsidianVisor}>
            <boxGeometry args={[0.48, 0.2, 0.16]} />
          </mesh>

          {/* High-Tech Eye Display / Intelligence Waveform */}
          <mesh position={[0, 0.08, 0.25]} material={materials.iceGlow}>
            <boxGeometry args={[0.32, 0.035, 0.01]} />
          </mesh>
          <mesh position={[-0.1, 0.08, 0.252]} material={materials.cyanNeon}>
            <sphereGeometry args={[0.025, 16, 16]} />
          </mesh>
          <mesh position={[0.1, 0.08, 0.252]} material={materials.cyanNeon}>
            <sphereGeometry args={[0.025, 16, 16]} />
          </mesh>
          <pointLight position={[0, 0.08, 0.35]} color="#00B4D8" intensity={0.7} distance={1.2} />
        </group>

        {/* ========================================================
            RIGHT ARM (SWIPER) ASSEMBLY
        ======================================================== */}
        <group position={[-0.58, 0.8, 0]}>
          {/* Chrome Shoulder Ball Joint */}
          <mesh material={materials.polishedChrome}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>

          {/* Shoulder Armor Guard */}
          <mesh position={[-0.08, 0.06, 0]} material={materials.whiteCeramic} castShadow>
            <boxGeometry args={[0.22, 0.18, 0.28]} />
          </mesh>

          {/* Right Arm Rotator Root */}
          <group ref={rightArmGroupRef}>
            {/* Upper Arm Bicep */}
            <mesh position={[0, -0.24, 0]} material={materials.whiteCeramic} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.32, 20]} />
            </mesh>

            {/* Elbow Articulation */}
            <mesh position={[0, -0.42, 0]} material={materials.polishedChrome}>
              <sphereGeometry args={[0.09, 20, 20]} />
            </mesh>

            {/* Forearm Group */}
            <group ref={rightForearmRef} position={[0, -0.42, 0]}>
              <mesh position={[0, -0.22, 0]} material={materials.whiteCeramic} castShadow>
                <cylinderGeometry args={[0.09, 0.07, 0.32, 20]} />
              </mesh>
              {/* Forearm Telemetry Rail */}
              <mesh position={[0, -0.22, 0.08]} material={materials.iceGlow}>
                <boxGeometry args={[0.02, 0.24, 0.01]} />
              </mesh>

              {/* Wrist & Hand */}
              <group ref={rightHandRef} position={[0, -0.4, 0]}>
                <mesh material={materials.polishedChrome}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                </mesh>
                {/* Palm */}
                <mesh position={[0, -0.07, 0]} material={materials.whiteCeramic}>
                  <boxGeometry args={[0.12, 0.1, 0.04]} />
                </mesh>
                {/* Articulated Fingers */}
                {[-0.04, -0.01, 0.02, 0.05].map((xOffset, i) => (
                  <mesh key={i} position={[xOffset, -0.15, 0]} material={materials.polishedChrome}>
                    <cylinderGeometry args={[0.012, 0.01, 0.08, 12]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>

        {/* ========================================================
            LEFT ARM (SWIPER) ASSEMBLY
        ======================================================== */}
        <group position={[0.58, 0.8, 0]}>
          {/* Chrome Shoulder Ball Joint */}
          <mesh material={materials.polishedChrome}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>

          {/* Shoulder Armor Guard */}
          <mesh position={[0.08, 0.06, 0]} material={materials.whiteCeramic} castShadow>
            <boxGeometry args={[0.22, 0.18, 0.28]} />
          </mesh>

          {/* Left Arm Rotator Root */}
          <group ref={leftArmGroupRef}>
            {/* Upper Arm Bicep */}
            <mesh position={[0, -0.24, 0]} material={materials.whiteCeramic} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.32, 20]} />
            </mesh>

            {/* Elbow Articulation */}
            <mesh position={[0, -0.42, 0]} material={materials.polishedChrome}>
              <sphereGeometry args={[0.09, 20, 20]} />
            </mesh>

            {/* Forearm Group */}
            <group ref={leftForearmRef} position={[0, -0.42, 0]}>
              <mesh position={[0, -0.22, 0]} material={materials.whiteCeramic} castShadow>
                <cylinderGeometry args={[0.09, 0.07, 0.32, 20]} />
              </mesh>
              {/* Forearm Telemetry Rail */}
              <mesh position={[0, -0.22, 0.08]} material={materials.iceGlow}>
                <boxGeometry args={[0.02, 0.24, 0.01]} />
              </mesh>

              {/* Wrist & Hand */}
              <group ref={leftHandRef} position={[0, -0.4, 0]}>
                <mesh material={materials.polishedChrome}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                </mesh>
                {/* Palm */}
                <mesh position={[0, -0.07, 0]} material={materials.whiteCeramic}>
                  <boxGeometry args={[0.12, 0.1, 0.04]} />
                </mesh>
                {/* Articulated Fingers */}
                {[-0.05, -0.02, 0.01, 0.04].map((xOffset, i) => (
                  <mesh key={i} position={[xOffset, -0.15, 0]} material={materials.polishedChrome}>
                    <cylinderGeometry args={[0.012, 0.01, 0.08, 12]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
