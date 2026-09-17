"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RobotModelProps {
  scrollProgress: number; // 0.0 to 1.0
  mousePosition?: { x: number; y: number };
}

// Keyframes for the robot's physical joints across the 6 cinematic phases
interface RobotKeyframe {
  pos: [number, number, number];
  rot: [number, number, number];
  rArm: [number, number, number];
  rForearmX: number;
  rHandY: number;
  lArm: [number, number, number];
  lForearmX: number;
  lHandY: number;
  headOffset: [number, number]; // [yaw, pitch]
}

const ROBOT_TRACK: RobotKeyframe[] = [
  // 0: Hero Init (p = 0.00 - 0.15)
  {
    pos: [0.0, 0.0, 0.0],
    rot: [0.0, 0.0, 0.0],
    rArm: [0.05, 0.0, -0.22],
    rForearmX: 0.25,
    rHandY: 0.0,
    lArm: [0.05, 0.0, 0.22],
    lForearmX: 0.25,
    lHandY: 0.0,
    headOffset: [0.0, 0.0],
  },
  // 1: NeuroSight OTS Right-Hand Sweep (p = 0.15 - 0.32)
  {
    pos: [0.95, -0.1, 0.1],
    rot: [0.04, -0.48, 0.0],
    rArm: [-0.75, -0.85, -0.55],
    rForearmX: 0.95,
    rHandY: -0.4,
    lArm: [0.0, 0.0, 0.2],
    lForearmX: 0.2,
    lHandY: 0.0,
    headOffset: [-0.35, -0.05],
  },
  // 2: RESP-AI Low-Angle Left-Hand Sweep (p = 0.32 - 0.50)
  {
    pos: [-0.95, 0.08, 0.15],
    rot: [-0.05, 0.45, 0.0],
    rArm: [0.0, 0.0, -0.2],
    rForearmX: 0.2,
    rHandY: 0.0,
    lArm: [-0.7, 0.82, 0.6],
    lForearmX: 0.92,
    lHandY: 0.4,
    headOffset: [0.35, 0.05],
  },
  // 3: AirGuardian Tactical Drone Overhead (p = 0.50 - 0.68)
  {
    pos: [0.0, -0.25, -0.25],
    rot: [0.18, 0.0, 0.0],
    rArm: [-0.85, -0.3, -0.35],
    rForearmX: 0.55,
    rHandY: -0.2,
    lArm: [-0.85, 0.3, 0.35],
    lForearmX: 0.55,
    lHandY: 0.2,
    headOffset: [0.0, -0.2],
  },
  // 4: Technical Arsenal 3/4 CAD View (p = 0.68 - 0.85)
  {
    pos: [-0.65, 0.0, 0.0],
    rot: [0.0, 0.62, 0.0],
    rArm: [-0.45, 0.0, -0.3],
    rForearmX: 1.1,
    rHandY: -0.5,
    lArm: [-0.25, 0.0, 0.35],
    lForearmX: 0.4,
    lHandY: 0.0,
    headOffset: [0.25, 0.0],
  },
  // 5: Contact Comms Frontal Intimate Framing (p = 0.85 - 1.00)
  {
    pos: [0.0, 0.0, 0.0],
    rot: [0.0, 0.0, 0.0],
    rArm: [-0.35, -0.2, -0.4],
    rForearmX: 0.65,
    rHandY: -0.15,
    lArm: [-0.35, 0.2, 0.4],
    lForearmX: 0.65,
    lHandY: 0.15,
    headOffset: [0.0, 0.0],
  },
];

export function RobotModel({ scrollProgress, mousePosition = { x: 0, y: 0 } }: RobotModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const swipeTrailRef = useRef<THREE.Mesh>(null);

  // High-End PBR Ceramic & Chrome Shaders
  const materials = useMemo(() => {
    const whiteCeramic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F8F9FA"),
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.92,
    });

    const polishedChrome = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2E8F0"),
      roughness: 0.08,
      metalness: 0.98,
    });

    const darkCarbon = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#18181B"),
      roughness: 0.35,
      metalness: 0.75,
    });

    const obsidianVisor = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#050508"),
      roughness: 0.04,
      metalness: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
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

    // 1. Natural Organic Idle Float & Respiratory Sway
    const floatY = Math.sin(time * 1.8) * 0.05;
    const idleTiltX = Math.sin(time * 0.9) * 0.015;
    const idleTiltZ = Math.cos(time * 1.2) * 0.012;

    // 2. Kinematic Spline Interpolation across 6 Phases
    const totalSegments = ROBOT_TRACK.length - 1;
    const clampedP = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    const scaled = clampedP * totalSegments;
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const t = scaled - index;

    // Cubic Hermite smoothstep
    const smoothT = t * t * (3 - 2 * t);

    const k0 = ROBOT_TRACK[index];
    const k1 = ROBOT_TRACK[index + 1];

    // Interpolate Robot Position & Torso Rotation
    const targetPosX = THREE.MathUtils.lerp(k0.pos[0], k1.pos[0], smoothT);
    const targetPosY = THREE.MathUtils.lerp(k0.pos[1], k1.pos[1], smoothT) + floatY;
    const targetPosZ = THREE.MathUtils.lerp(k0.pos[2], k1.pos[2], smoothT);

    const targetRotX = THREE.MathUtils.lerp(k0.rot[0], k1.rot[0], smoothT) + idleTiltX;
    const targetRotY = THREE.MathUtils.lerp(k0.rot[1], k1.rot[1], smoothT);
    const targetRotZ = THREE.MathUtils.lerp(k0.rot[2], k1.rot[2], smoothT) + idleTiltZ;

    if (rootGroupRef.current) {
      rootGroupRef.current.position.x = THREE.MathUtils.damp(rootGroupRef.current.position.x, targetPosX, 4.5, delta);
      rootGroupRef.current.position.y = THREE.MathUtils.damp(rootGroupRef.current.position.y, targetPosY, 4.5, delta);
      rootGroupRef.current.position.z = THREE.MathUtils.damp(rootGroupRef.current.position.z, targetPosZ, 4.5, delta);

      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, targetRotX, 4.5, delta);
      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(rootGroupRef.current.rotation.y, targetRotY, 4.5, delta);
      rootGroupRef.current.rotation.z = THREE.MathUtils.damp(rootGroupRef.current.rotation.z, targetRotZ, 4.5, delta);
    }

    // 3. Head Tracking (Cursor + Phase Offset)
    if (headGroupRef.current) {
      const headOffsetYaw = THREE.MathUtils.lerp(k0.headOffset[0], k1.headOffset[0], smoothT);
      const headOffsetPitch = THREE.MathUtils.lerp(k0.headOffset[1], k1.headOffset[1], smoothT);

      const lookTargetYaw = headOffsetYaw + (mousePosition.x * 0.35);
      const lookTargetPitch = headOffsetPitch + (-mousePosition.y * 0.25);

      headGroupRef.current.rotation.y = THREE.MathUtils.damp(headGroupRef.current.rotation.y, lookTargetYaw, 5.0, delta);
      headGroupRef.current.rotation.x = THREE.MathUtils.damp(headGroupRef.current.rotation.x, lookTargetPitch, 5.0, delta);
    }

    // 4. Right Arm Joint Kinematics
    if (rightArmGroupRef.current && rightForearmRef.current && rightHandRef.current) {
      const rArmX = THREE.MathUtils.lerp(k0.rArm[0], k1.rArm[0], smoothT);
      const rArmY = THREE.MathUtils.lerp(k0.rArm[1], k1.rArm[1], smoothT);
      const rArmZ = THREE.MathUtils.lerp(k0.rArm[2], k1.rArm[2], smoothT);
      const rForearmX = THREE.MathUtils.lerp(k0.rForearmX, k1.rForearmX, smoothT);
      const rHandY = THREE.MathUtils.lerp(k0.rHandY, k1.rHandY, smoothT);

      rightArmGroupRef.current.rotation.x = THREE.MathUtils.damp(rightArmGroupRef.current.rotation.x, rArmX, 5.0, delta);
      rightArmGroupRef.current.rotation.y = THREE.MathUtils.damp(rightArmGroupRef.current.rotation.y, rArmY, 5.0, delta);
      rightArmGroupRef.current.rotation.z = THREE.MathUtils.damp(rightArmGroupRef.current.rotation.z, rArmZ, 5.0, delta);

      rightForearmRef.current.rotation.x = THREE.MathUtils.damp(rightForearmRef.current.rotation.x, rForearmX, 5.0, delta);
      rightHandRef.current.rotation.y = THREE.MathUtils.damp(rightHandRef.current.rotation.y, rHandY, 5.0, delta);
    }

    // 5. Left Arm Joint Kinematics
    if (leftArmGroupRef.current && leftForearmRef.current && leftHandRef.current) {
      const lArmX = THREE.MathUtils.lerp(k0.lArm[0], k1.lArm[0], smoothT);
      const lArmY = THREE.MathUtils.lerp(k0.lArm[1], k1.lArm[1], smoothT);
      const lArmZ = THREE.MathUtils.lerp(k0.lArm[2], k1.lArm[2], smoothT);
      const lForearmX = THREE.MathUtils.lerp(k0.lForearmX, k1.lForearmX, smoothT);
      const lHandY = THREE.MathUtils.lerp(k0.lHandY, k1.lHandY, smoothT);

      leftArmGroupRef.current.rotation.x = THREE.MathUtils.damp(leftArmGroupRef.current.rotation.x, lArmX, 5.0, delta);
      leftArmGroupRef.current.rotation.y = THREE.MathUtils.damp(leftArmGroupRef.current.rotation.y, lArmY, 5.0, delta);
      leftArmGroupRef.current.rotation.z = THREE.MathUtils.damp(leftArmGroupRef.current.rotation.z, lArmZ, 5.0, delta);

      leftForearmRef.current.rotation.x = THREE.MathUtils.damp(leftForearmRef.current.rotation.x, lForearmX, 5.0, delta);
      leftHandRef.current.rotation.y = THREE.MathUtils.damp(leftHandRef.current.rotation.y, lHandY, 5.0, delta);
    }

    // 6. Reactor Core Pulse
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.3 + Math.sin(time * 3.2) * 0.4;
    }

    // 7. Dynamic Swipe Kinetic Arc
    if (swipeTrailRef.current) {
      const isSwiping = index === 1 || index === 2;
      swipeTrailRef.current.visible = isSwiping;
      if (isSwiping) {
        swipeTrailRef.current.rotation.z = (time * 2.5) % (Math.PI * 2);
      }
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]} scale={[1.12, 1.12, 1.12]}>
      {/* Swipe Kinetic Energy Ribbon */}
      <mesh ref={swipeTrailRef} visible={false} position={[0, 0.4, 0.5]}>
        <ringGeometry args={[1.2, 1.25, 64, 1, 0, Math.PI * 0.9]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* ========================================================
          TORSO / CHEST ASSEMBLY
      ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Main Upper Torso Ceramic Shell */}
        <mesh position={[0, 0.5, 0]} material={materials.whiteCeramic} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.82, 0.56]} />
        </mesh>

        {/* Slanted Aerodynamic Chest Armor Plates */}
        <mesh position={[0, 0.65, 0.23]} rotation={[0.2, 0, 0]} material={materials.whiteCeramic} castShadow>
          <boxGeometry args={[0.84, 0.46, 0.2]} />
        </mesh>

        {/* Back Spine & Radiator Vents */}
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

        {/* Lower Abdomen / Spinal Articulation */}
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
          {/* Neck Servos */}
          <mesh position={[0, -0.12, -0.02]} material={materials.polishedChrome}>
            <cylinderGeometry args={[0.12, 0.14, 0.18, 20]} />
          </mesh>

          {/* Sculpted Helmet */}
          <mesh position={[0, 0.08, -0.05]} material={materials.whiteCeramic} castShadow>
            <sphereGeometry args={[0.34, 32, 32]} />
          </mesh>

          {/* Ear Sensor Pods */}
          <mesh position={[-0.35, 0.08, -0.05]} rotation={[0, 0, Math.PI / 2]} material={materials.polishedChrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
          </mesh>
          <mesh position={[0.35, 0.08, -0.05]} rotation={[0, 0, Math.PI / 2]} material={materials.polishedChrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
          </mesh>

          {/* Obsidian Visor */}
          <mesh position={[0, 0.08, 0.16]} rotation={[0.12, 0, 0]} material={materials.obsidianVisor}>
            <boxGeometry args={[0.48, 0.2, 0.16]} />
          </mesh>

          {/* Cybernetic Eye Scanner Waveform */}
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
          <mesh material={materials.polishedChrome}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>
          <mesh position={[-0.08, 0.06, 0]} material={materials.whiteCeramic} castShadow>
            <boxGeometry args={[0.22, 0.18, 0.28]} />
          </mesh>

          <group ref={rightArmGroupRef}>
            <mesh position={[0, -0.24, 0]} material={materials.whiteCeramic} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.32, 20]} />
            </mesh>
            <mesh position={[0, -0.42, 0]} material={materials.polishedChrome}>
              <sphereGeometry args={[0.09, 20, 20]} />
            </mesh>

            <group ref={rightForearmRef} position={[0, -0.42, 0]}>
              <mesh position={[0, -0.22, 0]} material={materials.whiteCeramic} castShadow>
                <cylinderGeometry args={[0.09, 0.07, 0.32, 20]} />
              </mesh>
              <mesh position={[0, -0.22, 0.08]} material={materials.iceGlow}>
                <boxGeometry args={[0.02, 0.24, 0.01]} />
              </mesh>

              <group ref={rightHandRef} position={[0, -0.4, 0]}>
                <mesh material={materials.polishedChrome}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                </mesh>
                <mesh position={[0, -0.07, 0]} material={materials.whiteCeramic}>
                  <boxGeometry args={[0.12, 0.1, 0.04]} />
                </mesh>
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
          <mesh material={materials.polishedChrome}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>
          <mesh position={[0.08, 0.06, 0]} material={materials.whiteCeramic} castShadow>
            <boxGeometry args={[0.22, 0.18, 0.28]} />
          </mesh>

          <group ref={leftArmGroupRef}>
            <mesh position={[0, -0.24, 0]} material={materials.whiteCeramic} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.32, 20]} />
            </mesh>
            <mesh position={[0, -0.42, 0]} material={materials.polishedChrome}>
              <sphereGeometry args={[0.09, 20, 20]} />
            </mesh>

            <group ref={leftForearmRef} position={[0, -0.42, 0]}>
              <mesh position={[0, -0.22, 0]} material={materials.whiteCeramic} castShadow>
                <cylinderGeometry args={[0.09, 0.07, 0.32, 20]} />
              </mesh>
              <mesh position={[0, -0.22, 0.08]} material={materials.iceGlow}>
                <boxGeometry args={[0.02, 0.24, 0.01]} />
              </mesh>

              <group ref={leftHandRef} position={[0, -0.4, 0]}>
                <mesh material={materials.polishedChrome}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                </mesh>
                <mesh position={[0, -0.07, 0]} material={materials.whiteCeramic}>
                  <boxGeometry args={[0.12, 0.1, 0.04]} />
                </mesh>
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
