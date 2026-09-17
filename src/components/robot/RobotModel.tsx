"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface TouchPointData {
  x: number;
  y: number;
  z: number;
  active: boolean;
  intensity: number;
}

interface RobotModelProps {
  scrollProgress: number; // 0.0 to 1.0
  mousePosition?: { x: number; y: number };
  onTouchPointChange?: (point: TouchPointData) => void;
}

// Curved display surface geometry constants
const GLASS_RADIUS = 2.4;
const GLASS_SURFACE_Z = 0.52;

// Analytical cylinder glass surface function
function getGlassSurfaceZ(x: number): number {
  // Cylindrical curve equation: Z = Z_apex - (R - sqrt(R^2 - x^2))
  const dx = Math.min(Math.abs(x), 1.8);
  const sagitta = GLASS_RADIUS - Math.sqrt(Math.max(0.01, GLASS_RADIUS * GLASS_RADIUS - dx * dx));
  return GLASS_SURFACE_Z - sagitta * 0.5;
}

// Minimum-jerk polynomial trajectory (Flash & Hogan, 1985)
function minimumJerk(tau: number): number {
  const t = Math.max(0, Math.min(1, tau));
  return t * t * t * (10 - 15 * t + 6 * t * t);
}

// Kinematic lengths for the robotic limb (meters)
const L1 = 0.32; // Upper arm
const L2 = 0.28; // Forearm

interface ArmKinematicAngles {
  shoulderPitch: number;
  shoulderYaw: number;
  shoulderRoll: number;
  elbowFlex: number;
  forearmTwist: number;
  wristPitch: number;
  wristYaw: number;
}


function solveArmKinematics(
  targetTipX: number,
  isRight: boolean = true
): ArmKinematicAngles {
  // Reach progress along lateral swipe span (X: +0.34m to -0.06m for right arm, -0.34m to +0.06m for left arm)
  const reachProgress = isRight
    ? Math.max(0, Math.min(1, (0.34 - targetTipX) / 0.40))
    : Math.max(0, Math.min(1, (targetTipX - (-0.34)) / 0.40));
  const s = minimumJerk(reachProgress);

  // Upper arm orientation validated by user: shoulder to elbow pitch, yaw, roll
  const shoulderPitch = -(0.40 + s * 0.38);
  const shoulderYaw = isRight ? (-0.08 - s * 0.88) : (0.08 + s * 0.88);
  const shoulderRoll = isRight ? (0.20 - s * 0.08) : (-0.20 + s * 0.08);

  // Elbow forward flexion (reaching smoothly forward toward the curved glass console)
  const elbowFlex = (-115 + s * 40) * (Math.PI / 180);

  // Forearm pronation twist (turns the palm to face forward toward the curved console)
  const forearmTwist = isRight
    ? (60 + s * 10) * (Math.PI / 180)
    : (-60 - s * 10) * (Math.PI / 180);

  // Biomechanical derivative profile for wrist dynamic response
  const t = Math.max(0, Math.min(1, reachProgress));
  const vel = 30 * t * t * Math.pow(1 - t, 2); // Velocity bell curve peaking at stroke midpoint
  const acc = 60 * t * (1 - t) * (1 - 2 * t);  // Inertial acceleration (inflection at midpoint)

  // Dynamic wrist yaw: inertial lag (radial deviation) at stroke onset, follow-through flick (ulnar deviation) at release
  const lagFlick = -acc * 0.006 + vel * 0.012;
  const baseYaw = (28 + s * 10) * (Math.PI / 180);
  const wristYaw = isRight ? (baseYaw + lagFlick) : (-baseYaw - lagFlick);

  // Dynamic wrist pitch: levels hand horizontally with touch compliance dip on glass contact and terminal flick upon release
  const basePitch = (42 - s * 32) * (Math.PI / 180);
  const touchCompliance = Math.sin(t * Math.PI) * 0.035;
  const terminalFlick = Math.pow(Math.max(0, (t - 0.75) / 0.25), 2) * 0.05;
  const wristPitch = basePitch - touchCompliance + terminalFlick;

  return {
    shoulderPitch,
    shoulderYaw,
    shoulderRoll,
    elbowFlex,
    forearmTwist,
    wristPitch,
    wristYaw,
  };
}

export function RobotModel({ scrollProgress, mousePosition = { x: 0, y: 0 }, onTouchPointChange }: RobotModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const torsoGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);

  // Right Arm Kinematic Chain Refs
  const rClavicleRef = useRef<THREE.Group>(null);
  const rShoulderRef = useRef<THREE.Group>(null);
  const rElbowRef = useRef<THREE.Group>(null);
  const rForearmTwistRef = useRef<THREE.Group>(null);
  const rWristPitchRef = useRef<THREE.Group>(null);
  const rWristYawRef = useRef<THREE.Group>(null);
  const rHandRef = useRef<THREE.Group>(null);
  const rIndexMCPRef = useRef<THREE.Group>(null);
  const rIndexPIPRef = useRef<THREE.Group>(null);
  const rIndexDIPRef = useRef<THREE.Group>(null);
  const rMiddleMCPRef = useRef<THREE.Group>(null);
  const rRingMCPRef = useRef<THREE.Group>(null);
  const rPinkyMCPRef = useRef<THREE.Group>(null);
  const rThumbMCPRef = useRef<THREE.Group>(null);

  // Left Arm Kinematic Chain Refs
  const lClavicleRef = useRef<THREE.Group>(null);
  const lShoulderRef = useRef<THREE.Group>(null);
  const lElbowRef = useRef<THREE.Group>(null);
  const lForearmTwistRef = useRef<THREE.Group>(null);
  const lWristPitchRef = useRef<THREE.Group>(null);
  const lWristYawRef = useRef<THREE.Group>(null);
  const lHandRef = useRef<THREE.Group>(null);
  const lIndexMCPRef = useRef<THREE.Group>(null);
  const lIndexPIPRef = useRef<THREE.Group>(null);
  const lIndexDIPRef = useRef<THREE.Group>(null);
  const lMiddleMCPRef = useRef<THREE.Group>(null);
  const lRingMCPRef = useRef<THREE.Group>(null);
  const lPinkyMCPRef = useRef<THREE.Group>(null);
  const lThumbMCPRef = useRef<THREE.Group>(null);

  const coreLightRef = useRef<THREE.PointLight>(null);

  // High-End PBR Ceramic & Chrome Shaders
  const materials = useMemo(() => {
    const whiteCeramic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F8F9FA"),
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });

    const brushedTitanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#D1D5DB"),
      metalness: 0.92,
      roughness: 0.22,
    });

    const darkCarbon = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#111827"),
      roughness: 0.38,
      metalness: 0.65,
    });

    const cyanGlow = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#38BDF8"),
    });

    const eyeOptics = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#0284C7"),
    });

    const rubberPad = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1E293B"),
      roughness: 0.8,
      metalness: 0.1,
    });

    return { whiteCeramic, brushedTitanium, darkCarbon, cyanGlow, eyeOptics, rubberPad };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const p = Math.max(0, Math.min(1, scrollProgress));

    // 1. Biological Breathing & Base Poise
    if (rootGroupRef.current) {
      const breathe = Math.sin(time * 1.8) * 0.015;
      rootGroupRef.current.position.y = -0.22 + breathe;
    }

    // 2. Torso Kinetic Anticipation & Spinal Rotation
    if (torsoGroupRef.current) {
      let targetRotY = 0;
      let targetRotX = 0;
      let targetRotZ = 0;

      if (p < 0.15) {
        // Hero Idle: Facing forward, gentle gaze tracking
        targetRotY = mousePosition.x * 0.12;
        targetRotX = 0.02;
      } else if (p < 0.35) {
        // Right-Arm Swipe: Torso rotates into the swipe arc
        const swipeTau = (p - 0.15) / 0.20;
        const s = minimumJerk(swipeTau);
        targetRotY = 0.22 - s * 0.44; // Torso twists following arm velocity
        targetRotX = 0.06;
        targetRotZ = -0.04 * Math.sin(swipeTau * Math.PI);
      } else if (p < 0.55) {
        // Left-Arm Swipe: Torso rotates into left-to-right swipe arc
        const swipeTau = (p - 0.35) / 0.20;
        const s = minimumJerk(swipeTau);
        targetRotY = -0.22 + s * 0.44;
        targetRotX = 0.06;
        targetRotZ = 0.04 * Math.sin(swipeTau * Math.PI);
      } else if (p < 0.75) {
        // AirGuardian (Phase 3): Torso turns left toward the telemetry panel
        const phaseTau = (p - 0.55) / 0.20;
        targetRotY = -0.16 - Math.sin(phaseTau * Math.PI) * 0.04;
        targetRotX = 0.04;
        targetRotZ = 0.02;
      } else if (p < 0.90) {
        // Engineering Stack (Phase 4): Torso turns right toward the skill matrix panel
        const phaseTau = (p - 0.75) / 0.15;
        targetRotY = 0.16 + Math.sin(phaseTau * Math.PI) * 0.04;
        targetRotX = 0.04;
        targetRotZ = -0.02;
      } else {
        // Welcome Open Stance
        targetRotY = 0.0;
        targetRotX = -0.01;
      }

      torsoGroupRef.current.rotation.x = THREE.MathUtils.damp(torsoGroupRef.current.rotation.x, targetRotX, 10, delta);
      torsoGroupRef.current.rotation.y = THREE.MathUtils.damp(torsoGroupRef.current.rotation.y, targetRotY, 10, delta);
      torsoGroupRef.current.rotation.z = THREE.MathUtils.damp(torsoGroupRef.current.rotation.z, targetRotZ, 10, delta);
    }

    // 3. Head Gaze Tracking & Target Inspection
    if (headGroupRef.current) {
      let targetHeadPitch = -mousePosition.y * 0.2;
      let targetHeadYaw = mousePosition.x * 0.3;

      if (p >= 0.15 && p < 0.35) {
        // Eye-Gaze leads the right hand
        const swipeTau = (p - 0.15) / 0.20;
        const s = minimumJerk(swipeTau);
        targetHeadYaw = 0.30 - s * 0.60;
        targetHeadPitch = 0.12;
      } else if (p >= 0.35 && p < 0.55) {
        // Eye-Gaze leads the left hand
        const swipeTau = (p - 0.35) / 0.20;
        const s = minimumJerk(swipeTau);
        targetHeadYaw = -0.30 + s * 0.60;
        targetHeadPitch = 0.12;
      } else if (p >= 0.55 && p < 0.75) {
        // Looking left directly at the AirGuardian telemetry panel
        const phaseTau = (p - 0.55) / 0.20;
        targetHeadYaw = -0.28 - Math.sin(phaseTau * Math.PI) * 0.06;
        targetHeadPitch = 0.04;
      } else if (p >= 0.75 && p < 0.90) {
        // Looking right directly at the Engineering Stack matrix panel
        const phaseTau = (p - 0.75) / 0.15;
        targetHeadYaw = 0.28 + Math.sin(phaseTau * Math.PI) * 0.06;
        targetHeadPitch = 0.04;
      }

      headGroupRef.current.rotation.x = THREE.MathUtils.damp(headGroupRef.current.rotation.x, targetHeadPitch, 12, delta);
      headGroupRef.current.rotation.y = THREE.MathUtils.damp(headGroupRef.current.rotation.y, targetHeadYaw, 12, delta);
    }

    // =========================================================================
    // 4. ANALYTICAL INVERSE KINEMATICS & SCREEN-SWIPE SYSTEM
    // =========================================================================
    let currentTouchPoint: TouchPointData = { x: 0, y: 0, z: 0.52, active: false, intensity: 0 };

    // --- RIGHT ARM TRAJECTORY & IK ---
    if (
      rClavicleRef.current &&
      rShoulderRef.current &&
      rElbowRef.current &&
      rForearmTwistRef.current &&
      rWristPitchRef.current &&
      rWristYawRef.current &&
      rIndexMCPRef.current &&
      rIndexPIPRef.current &&
      rIndexDIPRef.current &&
      rMiddleMCPRef.current &&
      rRingMCPRef.current &&
      rPinkyMCPRef.current &&
      rThumbMCPRef.current
    ) {
      let clavicleProtraction = 0.04;
      let targetTipX = 0.32;
      let indexMCP = 0.20;
      let indexPIP = 0.15;
      let indexDIP = 0.04;
      let middleMCP = 0.28;
      let ringMCP = 0.38;
      let pinkyMCP = 0.48;
      let thumbMCP = 0.15;
      let isIK = false;

      if (p < 0.15) {
        // Phase 0: Poised Approach (Fingertip approaches the screen along screen normal)
        const t = p / 0.15;
        clavicleProtraction = 0.04 + t * 0.04;
        const targetX = 0.34 - t * 0.02;
        targetTipX = targetX;
        indexMCP = 0.20;
        indexPIP = 0.15;
        indexDIP = 0.04;
        middleMCP = 0.65;
        ringMCP = 0.80;
        pinkyMCP = 0.90;
        thumbMCP = 0.20;
        isIK = true;
      } else if (p >= 0.15 && p < 0.35) {
        // Phase 1: Biomechanical Screen Swipe Leftward Across Curved Glass
        const swipeTau = (p - 0.15) / 0.20;
        const s = minimumJerk(swipeTau);

        // Sweeps comfortably from X = +0.32m to -0.06m (38cm natural span)
        const targetX = 0.32 - s * 0.38;
        const targetY = 0.74 - Math.sin(swipeTau * Math.PI) * 0.015;
        const targetZ = getGlassSurfaceZ(targetX);

        clavicleProtraction = 0.08 + Math.sin(swipeTau * Math.PI) * 0.04;

        // Follow-through flick and release at terminal boundary
        if (swipeTau > 0.82) {
          const releaseProgress = (swipeTau - 0.82) / 0.18;
          indexMCP = 0.20 - releaseProgress * 0.15; // flick upward/outward
          indexPIP = 0.15 - releaseProgress * 0.10;
          middleMCP = 0.65 - releaseProgress * 0.12;
          ringMCP = 0.80 - releaseProgress * 0.15;
          pinkyMCP = 0.90 - releaseProgress * 0.18;
          thumbMCP = 0.18 - releaseProgress * 0.06;
        } else {
          // Compliant absorption while swiping on glass (curls gently into display)
          indexMCP = 0.20;
          indexPIP = 0.15;
          middleMCP = 0.68;
          ringMCP = 0.84;
          pinkyMCP = 0.96;
          thumbMCP = 0.22;
        }

        targetTipX = targetX;
        indexDIP = 0.04;
        isIK = true;

        // Capacitive Touch Contact on Glass
        if (swipeTau <= 0.82) {
          const contactIntensity = Math.sin((swipeTau / 0.82) * Math.PI);
          if (contactIntensity > 0.08) {
            currentTouchPoint = {
              x: targetX,
              y: targetY,
              z: targetZ,
              active: true,
              intensity: contactIntensity * 1.6,
            };
          }
        }
      } else if (p >= 0.35 && p < 0.55) {
        // Phase 2: Natural Anatomical Rest at Flank with Flexion Cascade & Micro-Breathing
        const idleBreathing = Math.sin(time * 1.5);
        clavicleProtraction = 0.03 + idleBreathing * 0.003;
        rClavicleRef.current.position.z = THREE.MathUtils.damp(rClavicleRef.current.position.z, clavicleProtraction, 10, delta);
        rShoulderRef.current.rotation.x = THREE.MathUtils.damp(rShoulderRef.current.rotation.x, -0.10 + idleBreathing * 0.006, 10, delta);
        rShoulderRef.current.rotation.y = THREE.MathUtils.damp(rShoulderRef.current.rotation.y, -0.05, 10, delta);
        rShoulderRef.current.rotation.z = THREE.MathUtils.damp(rShoulderRef.current.rotation.z, 0.14, 10, delta);
        rElbowRef.current.rotation.x = THREE.MathUtils.damp(rElbowRef.current.rotation.x, -22 * (Math.PI / 180) + Math.cos(time * 1.5) * 0.005, 10, delta);
        rForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(rForearmTwistRef.current.rotation.y, 35 * (Math.PI / 180), 10, delta);
        rWristPitchRef.current.rotation.x = THREE.MathUtils.damp(rWristPitchRef.current.rotation.x, 8 * (Math.PI / 180) + idleBreathing * 0.005, 10, delta);
        rWristYawRef.current.rotation.y = THREE.MathUtils.damp(rWristYawRef.current.rotation.y, 5 * (Math.PI / 180), 10, delta);

        // Clinical Anatomical Position of Rest: Biological Flexion Cascade
        indexMCP = 0.18 + idleBreathing * 0.012;
        indexPIP = 0.22;
        indexDIP = 0.08;
        middleMCP = 0.28 + idleBreathing * 0.015;
        ringMCP = 0.38 + idleBreathing * 0.018;
        pinkyMCP = 0.48 + idleBreathing * 0.020;
        thumbMCP = 0.15 + idleBreathing * 0.010;
        isIK = false;
      } else if (p >= 0.55 && p < 0.75) {
        // Phase 3: AirGuardian - Right Arm in Poised Resting Support at Flank
        const idleBreathing = Math.sin(time * 1.5);
        clavicleProtraction = 0.03 + idleBreathing * 0.003;
        rClavicleRef.current.position.z = THREE.MathUtils.damp(rClavicleRef.current.position.z, clavicleProtraction, 10, delta);
        rShoulderRef.current.rotation.x = THREE.MathUtils.damp(rShoulderRef.current.rotation.x, -0.12 + idleBreathing * 0.005, 10, delta);
        rShoulderRef.current.rotation.y = THREE.MathUtils.damp(rShoulderRef.current.rotation.y, -0.05, 10, delta);
        rShoulderRef.current.rotation.z = THREE.MathUtils.damp(rShoulderRef.current.rotation.z, 0.14, 10, delta);
        rElbowRef.current.rotation.x = THREE.MathUtils.damp(rElbowRef.current.rotation.x, -22 * (Math.PI / 180), 10, delta);
        rForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(rForearmTwistRef.current.rotation.y, 35 * (Math.PI / 180), 10, delta);
        rWristPitchRef.current.rotation.x = THREE.MathUtils.damp(rWristPitchRef.current.rotation.x, 8 * (Math.PI / 180), 10, delta);
        rWristYawRef.current.rotation.y = THREE.MathUtils.damp(rWristYawRef.current.rotation.y, 5 * (Math.PI / 180), 10, delta);

        indexMCP = 0.18 + idleBreathing * 0.010;
        indexPIP = 0.22;
        indexDIP = 0.08;
        middleMCP = 0.28 + idleBreathing * 0.012;
        ringMCP = 0.38 + idleBreathing * 0.015;
        pinkyMCP = 0.48 + idleBreathing * 0.018;
        thumbMCP = 0.15 + idleBreathing * 0.008;
        isIK = false;
      } else if (p >= 0.75 && p < 0.90) {
        // Phase 4: Precision Technical Arsenal Pointing Gesture directly to Right Panel
        const phaseTau = (p - 0.75) / 0.15;
        const pulse = Math.sin(phaseTau * Math.PI) * 0.03;

        clavicleProtraction = 0.06 + pulse * 0.02;
        rClavicleRef.current.position.z = THREE.MathUtils.damp(rClavicleRef.current.position.z, clavicleProtraction, 12, delta);
        // Reach forward-right directly at the Engineering Stack card (X ≈ +0.66m, Y ≈ 0.76m)
        rShoulderRef.current.rotation.x = THREE.MathUtils.damp(rShoulderRef.current.rotation.x, -70 * (Math.PI / 180) + pulse * 0.05, 12, delta);
        rShoulderRef.current.rotation.y = THREE.MathUtils.damp(rShoulderRef.current.rotation.y, 10 * (Math.PI / 180) + pulse * 0.04, 12, delta);
        rShoulderRef.current.rotation.z = THREE.MathUtils.damp(rShoulderRef.current.rotation.z, 30 * (Math.PI / 180), 12, delta);
        rElbowRef.current.rotation.x = THREE.MathUtils.damp(rElbowRef.current.rotation.x, -35 * (Math.PI / 180), 12, delta);
        rForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(rForearmTwistRef.current.rotation.y, 35 * (Math.PI / 180), 12, delta);
        rWristPitchRef.current.rotation.x = THREE.MathUtils.damp(rWristPitchRef.current.rotation.x, 20 * (Math.PI / 180), 12, delta);
        rWristYawRef.current.rotation.y = THREE.MathUtils.damp(rWristYawRef.current.rotation.y, 0, 12, delta);

        // Authoritative pointing digit posture (Index extended, other fingers curled into palm)
        indexMCP = 0.02;
        indexPIP = 0.02;
        indexDIP = 0.00;
        middleMCP = 0.85;
        ringMCP = 1.05;
        pinkyMCP = 1.20;
        thumbMCP = 0.28;
        isIK = false;
      } else {
        // Phase 5: Welcoming Open Stance (Hands raised level towards viewer)
        clavicleProtraction = 0.04;
        rClavicleRef.current.position.z = THREE.MathUtils.damp(rClavicleRef.current.position.z, 0.04, 10, delta);
        rShoulderRef.current.rotation.x = THREE.MathUtils.damp(rShoulderRef.current.rotation.x, -35 * (Math.PI / 180), 10, delta);
        rShoulderRef.current.rotation.y = THREE.MathUtils.damp(rShoulderRef.current.rotation.y, -25 * (Math.PI / 180), 10, delta);
        rShoulderRef.current.rotation.z = THREE.MathUtils.damp(rShoulderRef.current.rotation.z, 15 * (Math.PI / 180), 10, delta);
        rElbowRef.current.rotation.x = THREE.MathUtils.damp(rElbowRef.current.rotation.x, -65 * (Math.PI / 180), 10, delta);
        rForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(rForearmTwistRef.current.rotation.y, 50 * (Math.PI / 180), 10, delta);
        rWristPitchRef.current.rotation.x = THREE.MathUtils.damp(rWristPitchRef.current.rotation.x, 10 * (Math.PI / 180), 10, delta);
        rWristYawRef.current.rotation.y = THREE.MathUtils.damp(rWristYawRef.current.rotation.y, 15 * (Math.PI / 180), 10, delta);
        indexMCP = 0.10;
        indexPIP = 0.08;
        indexDIP = 0.04;
        middleMCP = 0.15;
        ringMCP = 0.20;
        pinkyMCP = 0.24;
        thumbMCP = 0.12;
        isIK = false;
      }

      if (isIK) {
        const angles = solveArmKinematics(targetTipX, true);

        rClavicleRef.current.position.z = THREE.MathUtils.damp(rClavicleRef.current.position.z, clavicleProtraction, 12, delta);
        rShoulderRef.current.rotation.x = THREE.MathUtils.damp(rShoulderRef.current.rotation.x, angles.shoulderPitch, 14, delta);
        rShoulderRef.current.rotation.y = THREE.MathUtils.damp(rShoulderRef.current.rotation.y, angles.shoulderYaw, 14, delta);
        rShoulderRef.current.rotation.z = THREE.MathUtils.damp(rShoulderRef.current.rotation.z, angles.shoulderRoll, 14, delta);
        rElbowRef.current.rotation.x = THREE.MathUtils.damp(rElbowRef.current.rotation.x, angles.elbowFlex, 14, delta);
        rForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(rForearmTwistRef.current.rotation.y, angles.forearmTwist, 12, delta);
        rWristPitchRef.current.rotation.x = THREE.MathUtils.damp(rWristPitchRef.current.rotation.x, angles.wristPitch, 14, delta);
        rWristYawRef.current.rotation.y = THREE.MathUtils.damp(rWristYawRef.current.rotation.y, angles.wristYaw, 14, delta);
      }

      rIndexMCPRef.current.rotation.x = THREE.MathUtils.damp(rIndexMCPRef.current.rotation.x, indexMCP, 15, delta);
      rIndexPIPRef.current.rotation.x = THREE.MathUtils.damp(rIndexPIPRef.current.rotation.x, indexPIP, 15, delta);
      rIndexDIPRef.current.rotation.x = THREE.MathUtils.damp(rIndexDIPRef.current.rotation.x, indexDIP, 15, delta);

      rMiddleMCPRef.current.rotation.x = THREE.MathUtils.damp(rMiddleMCPRef.current.rotation.x, middleMCP, 12, delta);
      rRingMCPRef.current.rotation.x = THREE.MathUtils.damp(rRingMCPRef.current.rotation.x, ringMCP, 12, delta);
      rPinkyMCPRef.current.rotation.x = THREE.MathUtils.damp(rPinkyMCPRef.current.rotation.x, pinkyMCP, 12, delta);
      rThumbMCPRef.current.rotation.x = THREE.MathUtils.damp(rThumbMCPRef.current.rotation.x, thumbMCP, 12, delta);
    }

    // --- LEFT ARM TRAJECTORY & IK ---
    if (
      lClavicleRef.current &&
      lShoulderRef.current &&
      lElbowRef.current &&
      lForearmTwistRef.current &&
      lWristPitchRef.current &&
      lWristYawRef.current &&
      lIndexMCPRef.current &&
      lIndexPIPRef.current &&
      lIndexDIPRef.current &&
      lMiddleMCPRef.current &&
      lRingMCPRef.current &&
      lPinkyMCPRef.current &&
      lThumbMCPRef.current
    ) {
      let clavicleProtraction = 0.04;
      let targetTipX = -0.34;
      let indexMCP = 0.20;
      let indexPIP = 0.15;
      let indexDIP = 0.04;
      let middleMCP = 0.28;
      let ringMCP = 0.38;
      let pinkyMCP = 0.48;
      let thumbMCP = 0.15;
      let isIK = false;

      if (p < 0.35) {
        // Phase 0 & 1: Natural Anatomical Rest at Flank with Flexion Cascade & Micro-Breathing
        const idleBreathing = Math.sin(time * 1.5);
        clavicleProtraction = 0.03 + idleBreathing * 0.003;
        lClavicleRef.current.position.z = THREE.MathUtils.damp(lClavicleRef.current.position.z, clavicleProtraction, 10, delta);
        lShoulderRef.current.rotation.x = THREE.MathUtils.damp(lShoulderRef.current.rotation.x, -0.10 + idleBreathing * 0.006, 10, delta);
        lShoulderRef.current.rotation.y = THREE.MathUtils.damp(lShoulderRef.current.rotation.y, 0.05, 10, delta);
        lShoulderRef.current.rotation.z = THREE.MathUtils.damp(lShoulderRef.current.rotation.z, -0.14, 10, delta);
        lElbowRef.current.rotation.x = THREE.MathUtils.damp(lElbowRef.current.rotation.x, -22 * (Math.PI / 180) + Math.cos(time * 1.5) * 0.005, 10, delta);
        lForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(lForearmTwistRef.current.rotation.y, -35 * (Math.PI / 180), 10, delta);
        lWristPitchRef.current.rotation.x = THREE.MathUtils.damp(lWristPitchRef.current.rotation.x, 8 * (Math.PI / 180) + idleBreathing * 0.005, 10, delta);
        lWristYawRef.current.rotation.y = THREE.MathUtils.damp(lWristYawRef.current.rotation.y, -5 * (Math.PI / 180), 10, delta);

        // Clinical Anatomical Position of Rest: Biological Flexion Cascade
        indexMCP = 0.18 + idleBreathing * 0.012;
        indexPIP = 0.22;
        indexDIP = 0.08;
        middleMCP = 0.28 + idleBreathing * 0.015;
        ringMCP = 0.38 + idleBreathing * 0.018;
        pinkyMCP = 0.48 + idleBreathing * 0.020;
        thumbMCP = 0.15 + idleBreathing * 0.010;
        isIK = false;
      } else if (p >= 0.35 && p < 0.55) {
        // Phase 2: Biomechanical Screen Swipe Left-to-Right Across Curved Glass
        const swipeTau = (p - 0.35) / 0.20;
        const s = minimumJerk(swipeTau);

        // Sweeps comfortably from X = -0.32m to +0.06m (38cm natural span)
        const targetX = -0.32 + s * 0.38;
        const targetY = 0.74 - Math.sin(swipeTau * Math.PI) * 0.015;
        let targetZ = getGlassSurfaceZ(targetX);

        clavicleProtraction = 0.08 + Math.sin(swipeTau * Math.PI) * 0.04;

        // Follow-through flick and release
        if (swipeTau > 0.82) {
          const releaseProgress = (swipeTau - 0.82) / 0.18;
          targetZ += releaseProgress * 0.04;
          indexMCP = 0.20 - releaseProgress * 0.15;
          indexPIP = 0.15 - releaseProgress * 0.10;
          middleMCP = 0.65 - releaseProgress * 0.12;
          ringMCP = 0.80 - releaseProgress * 0.15;
          pinkyMCP = 0.90 - releaseProgress * 0.18;
          thumbMCP = 0.18 - releaseProgress * 0.06;
        } else {
          indexMCP = 0.20;
          indexPIP = 0.15;
          middleMCP = 0.68;
          ringMCP = 0.84;
          pinkyMCP = 0.96;
          thumbMCP = 0.22;
        }

        targetTipX = targetX;
        indexDIP = 0.04;
        isIK = true;

        if (swipeTau <= 0.82) {
          const contactIntensity = Math.sin((swipeTau / 0.82) * Math.PI);
          if (contactIntensity > 0.08) {
            currentTouchPoint = {
              x: targetX,
              y: targetY,
              z: targetZ,
              active: true,
              intensity: contactIntensity * 1.6,
            };
          }
        }
      } else if (p >= 0.55 && p < 0.75) {
        // Phase 3: AirGuardian Autonomous Robotics Pointing Gesture directly to Left Panel
        const phaseTau = (p - 0.55) / 0.20;
        const pulse = Math.sin(phaseTau * Math.PI) * 0.03;

        clavicleProtraction = 0.06 + pulse * 0.02;
        lClavicleRef.current.position.z = THREE.MathUtils.damp(lClavicleRef.current.position.z, clavicleProtraction, 12, delta);
        // Reach forward-left directly at the AirGuardian card (X ≈ -0.66m, Y ≈ 0.76m)
        lShoulderRef.current.rotation.x = THREE.MathUtils.damp(lShoulderRef.current.rotation.x, -70 * (Math.PI / 180) + pulse * 0.05, 12, delta);
        lShoulderRef.current.rotation.y = THREE.MathUtils.damp(lShoulderRef.current.rotation.y, -10 * (Math.PI / 180) - pulse * 0.04, 12, delta);
        lShoulderRef.current.rotation.z = THREE.MathUtils.damp(lShoulderRef.current.rotation.z, -30 * (Math.PI / 180), 12, delta);
        lElbowRef.current.rotation.x = THREE.MathUtils.damp(lElbowRef.current.rotation.x, -35 * (Math.PI / 180), 12, delta);
        lForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(lForearmTwistRef.current.rotation.y, -35 * (Math.PI / 180), 12, delta);
        lWristPitchRef.current.rotation.x = THREE.MathUtils.damp(lWristPitchRef.current.rotation.x, 20 * (Math.PI / 180), 12, delta);
        lWristYawRef.current.rotation.y = THREE.MathUtils.damp(lWristYawRef.current.rotation.y, 0, 12, delta);

        // Authoritative pointing digit posture (Index extended, other fingers curled into palm)
        indexMCP = 0.02;
        indexPIP = 0.02;
        indexDIP = 0.00;
        middleMCP = 0.85;
        ringMCP = 1.05;
        pinkyMCP = 1.20;
        thumbMCP = 0.28;
        isIK = false;
      } else if (p >= 0.75 && p < 0.90) {
        // Phase 4: Left Arm in Poised Resting Support at Flank
        const idleBreathing = Math.sin(time * 1.5);
        clavicleProtraction = 0.03 + idleBreathing * 0.003;
        lClavicleRef.current.position.z = THREE.MathUtils.damp(lClavicleRef.current.position.z, clavicleProtraction, 10, delta);
        lShoulderRef.current.rotation.x = THREE.MathUtils.damp(lShoulderRef.current.rotation.x, -0.12 + idleBreathing * 0.005, 10, delta);
        lShoulderRef.current.rotation.y = THREE.MathUtils.damp(lShoulderRef.current.rotation.y, 0.05, 10, delta);
        lShoulderRef.current.rotation.z = THREE.MathUtils.damp(lShoulderRef.current.rotation.z, -0.14, 10, delta);
        lElbowRef.current.rotation.x = THREE.MathUtils.damp(lElbowRef.current.rotation.x, -22 * (Math.PI / 180), 10, delta);
        lForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(lForearmTwistRef.current.rotation.y, -35 * (Math.PI / 180), 10, delta);
        lWristPitchRef.current.rotation.x = THREE.MathUtils.damp(lWristPitchRef.current.rotation.x, 8 * (Math.PI / 180), 10, delta);
        lWristYawRef.current.rotation.y = THREE.MathUtils.damp(lWristYawRef.current.rotation.y, -5 * (Math.PI / 180), 10, delta);

        indexMCP = 0.18 + idleBreathing * 0.010;
        indexPIP = 0.22;
        indexDIP = 0.08;
        middleMCP = 0.28 + idleBreathing * 0.012;
        ringMCP = 0.38 + idleBreathing * 0.015;
        pinkyMCP = 0.48 + idleBreathing * 0.018;
        thumbMCP = 0.15 + idleBreathing * 0.008;
        isIK = false;
      } else {
        // Phase 5: Welcoming Open Stance (Hands raised level towards viewer)
        clavicleProtraction = 0.04;
        lClavicleRef.current.position.z = THREE.MathUtils.damp(lClavicleRef.current.position.z, 0.04, 10, delta);
        lShoulderRef.current.rotation.x = THREE.MathUtils.damp(lShoulderRef.current.rotation.x, -35 * (Math.PI / 180), 10, delta);
        lShoulderRef.current.rotation.y = THREE.MathUtils.damp(lShoulderRef.current.rotation.y, 25 * (Math.PI / 180), 10, delta);
        lShoulderRef.current.rotation.z = THREE.MathUtils.damp(lShoulderRef.current.rotation.z, -15 * (Math.PI / 180), 10, delta);
        lElbowRef.current.rotation.x = THREE.MathUtils.damp(lElbowRef.current.rotation.x, -65 * (Math.PI / 180), 10, delta);
        lForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(lForearmTwistRef.current.rotation.y, -50 * (Math.PI / 180), 10, delta);
        lWristPitchRef.current.rotation.x = THREE.MathUtils.damp(lWristPitchRef.current.rotation.x, 10 * (Math.PI / 180), 10, delta);
        lWristYawRef.current.rotation.y = THREE.MathUtils.damp(lWristYawRef.current.rotation.y, -15 * (Math.PI / 180), 10, delta);
        indexMCP = 0.10;
        indexPIP = 0.08;
        indexDIP = 0.04;
        middleMCP = 0.15;
        ringMCP = 0.20;
        pinkyMCP = 0.24;
        thumbMCP = 0.12;
        isIK = false;
      }

      if (isIK) {
        const angles = solveArmKinematics(targetTipX, false);

        lClavicleRef.current.position.z = THREE.MathUtils.damp(lClavicleRef.current.position.z, clavicleProtraction, 12, delta);
        lShoulderRef.current.rotation.x = THREE.MathUtils.damp(lShoulderRef.current.rotation.x, angles.shoulderPitch, 14, delta);
        lShoulderRef.current.rotation.y = THREE.MathUtils.damp(lShoulderRef.current.rotation.y, angles.shoulderYaw, 14, delta);
        lShoulderRef.current.rotation.z = THREE.MathUtils.damp(lShoulderRef.current.rotation.z, angles.shoulderRoll, 14, delta);
        lElbowRef.current.rotation.x = THREE.MathUtils.damp(lElbowRef.current.rotation.x, angles.elbowFlex, 14, delta);
        lForearmTwistRef.current.rotation.y = THREE.MathUtils.damp(lForearmTwistRef.current.rotation.y, angles.forearmTwist, 12, delta);
        lWristPitchRef.current.rotation.x = THREE.MathUtils.damp(lWristPitchRef.current.rotation.x, angles.wristPitch, 14, delta);
        lWristYawRef.current.rotation.y = THREE.MathUtils.damp(lWristYawRef.current.rotation.y, angles.wristYaw, 14, delta);
      }

      lIndexMCPRef.current.rotation.x = THREE.MathUtils.damp(lIndexMCPRef.current.rotation.x, indexMCP, 15, delta);
      lIndexPIPRef.current.rotation.x = THREE.MathUtils.damp(lIndexPIPRef.current.rotation.x, indexPIP, 15, delta);
      lIndexDIPRef.current.rotation.x = THREE.MathUtils.damp(lIndexDIPRef.current.rotation.x, indexDIP, 15, delta);

      lMiddleMCPRef.current.rotation.x = THREE.MathUtils.damp(lMiddleMCPRef.current.rotation.x, middleMCP, 12, delta);
      lRingMCPRef.current.rotation.x = THREE.MathUtils.damp(lRingMCPRef.current.rotation.x, ringMCP, 12, delta);
      lPinkyMCPRef.current.rotation.x = THREE.MathUtils.damp(lPinkyMCPRef.current.rotation.x, pinkyMCP, 12, delta);
      lThumbMCPRef.current.rotation.x = THREE.MathUtils.damp(lThumbMCPRef.current.rotation.x, thumbMCP, 12, delta);
    }

    // Pass touch point to GlassConsole3D
    onTouchPointChange?.(currentTouchPoint);

    // Arc reactor pulse
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.8 + Math.sin(time * 3.5) * 0.4;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.22, 0]}>
      {/* Torso & Spinal Assembly */}
      <group ref={torsoGroupRef}>
        {/* Chest Armor Plate (Ceramic Clearcoat) */}
        <mesh position={[0, 0.7, 0]} material={materials.whiteCeramic}>
          <boxGeometry args={[0.56, 0.52, 0.32]} />
        </mesh>

        {/* Pectoral Carbon Insets */}
        <mesh position={[0.16, 0.78, 0.165]} material={materials.darkCarbon}>
          <boxGeometry args={[0.18, 0.18, 0.03]} />
        </mesh>
        <mesh position={[-0.16, 0.78, 0.165]} material={materials.darkCarbon}>
          <boxGeometry args={[0.18, 0.18, 0.03]} />
        </mesh>

        {/* Glowing Arc Reactor Core */}
        <group position={[0, 0.68, 0.17]}>
          <mesh material={materials.brushedTitanium} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 32]} />
          </mesh>
          <mesh material={materials.cyanGlow} position={[0, 0, 0.015]}>
            <circleGeometry args={[0.05, 32]} />
          </mesh>
          <pointLight ref={coreLightRef} color="#38BDF8" distance={1.4} intensity={1.8} />
        </group>

        {/* Spine Hydraulic Column */}
        <mesh position={[0, 0.32, 0]} material={materials.brushedTitanium}>
          <cylinderGeometry args={[0.12, 0.15, 0.35, 24]} />
        </mesh>
        {/* Flank Armor Ribs */}
        <mesh position={[0.23, 0.35, 0.05]} material={materials.whiteCeramic}>
          <boxGeometry args={[0.08, 0.28, 0.18]} />
        </mesh>
        <mesh position={[-0.23, 0.35, 0.05]} material={materials.whiteCeramic}>
          <boxGeometry args={[0.08, 0.28, 0.18]} />
        </mesh>

        {/* Pelvis Chassis */}
        <mesh position={[0, 0.1, 0]} material={materials.darkCarbon}>
          <boxGeometry args={[0.46, 0.18, 0.26]} />
        </mesh>

        {/* Neck Gimbal */}
        <mesh position={[0, 1.0, 0]} material={materials.brushedTitanium}>
          <cylinderGeometry args={[0.08, 0.09, 0.15, 24]} />
        </mesh>

        {/* HEAD ASSEMBLY */}
        <group ref={headGroupRef} position={[0, 1.16, 0]}>
          <mesh material={materials.whiteCeramic}>
            <sphereGeometry args={[0.22, 32, 24]} />
          </mesh>
          {/* Face Visor Inset */}
          <mesh position={[0, 0.02, 0.12]} material={materials.darkCarbon}>
            <boxGeometry args={[0.26, 0.18, 0.14]} />
          </mesh>
          {/* Glowing Optical Eye Array */}
          <group position={[0, 0.04, 0.20]}>
            <mesh position={[0.07, 0, 0]} material={materials.eyeOptics}>
              <boxGeometry args={[0.06, 0.015, 0.02]} />
            </mesh>
            <mesh position={[-0.07, 0, 0]} material={materials.eyeOptics}>
              <boxGeometry args={[0.06, 0.015, 0.02]} />
            </mesh>
          </group>
          {/* Lateral Sensor Ears */}
          <mesh position={[0.23, 0, 0]} material={materials.brushedTitanium} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          </mesh>
          <mesh position={[-0.23, 0, 0]} material={materials.brushedTitanium} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          </mesh>
        </group>

        {/* ================================================================= */}
        {/* RIGHT ARM ARTICULATION (7-DOF Kinematic Chain) */}
        {/* ================================================================= */}
        <group ref={rClavicleRef} position={[0.34, 0.82, 0.05]}>
          <group ref={rShoulderRef}>
            {/* Shoulder Pauldron Shell */}
            <mesh material={materials.whiteCeramic}>
              <sphereGeometry args={[0.13, 24, 24]} />
            </mesh>
            {/* Humerus / Upper Arm (Length L1 = 0.32m) */}
            <mesh position={[0.01, -0.16, 0]} material={materials.whiteCeramic}>
              <cylinderGeometry args={[0.075, 0.068, L1, 20]} />
            </mesh>

            {/* Elbow Hinge Joint */}
            <group ref={rElbowRef} position={[0.01, -L1, 0]}>
              <mesh material={materials.brushedTitanium}>
                <sphereGeometry args={[0.075, 20, 20]} />
              </mesh>
              {/* Forearm (Radius/Ulna, Length L2 = 0.28m) */}
              <group ref={rForearmTwistRef}>
                <mesh position={[0, -0.14, 0]} material={materials.whiteCeramic}>
                  <cylinderGeometry args={[0.065, 0.055, L2, 20]} />
                </mesh>

                {/* Wrist Joint (Carpal 2-Axis Gimbal) */}
                <group ref={rWristPitchRef} position={[0, -L2, 0]}>
                  <group ref={rWristYawRef}>
                    <mesh material={materials.brushedTitanium}>
                      <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
                    </mesh>

                    {/* Palm Chassis */}
                    <group ref={rHandRef} position={[0, -0.06, 0]}>
                      <mesh material={materials.darkCarbon}>
                        <boxGeometry args={[0.07, 0.08, 0.03]} />
                      </mesh>

                      {/* 1. INDEX FINGER (Primary Touch Screen Actor) */}
                      <group ref={rIndexMCPRef} position={[-0.024, -0.045, 0]}>
                        <mesh position={[0, -0.025, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.011, 0.010, 0.05, 12]} />
                        </mesh>
                        <group ref={rIndexPIPRef} position={[0, -0.05, 0]}>
                          <mesh position={[0, -0.02, 0]} material={materials.brushedTitanium}>
                            <cylinderGeometry args={[0.010, 0.009, 0.04, 12]} />
                          </mesh>
                          <group ref={rIndexDIPRef} position={[0, -0.04, 0]}>
                            {/* Distal phalanx + conductive capacitive silicone pad */}
                            <mesh position={[0, -0.015, 0]} material={materials.whiteCeramic}>
                              <cylinderGeometry args={[0.009, 0.008, 0.03, 12]} />
                            </mesh>
                            <mesh position={[0, -0.025, 0.006]} material={materials.rubberPad}>
                              <boxGeometry args={[0.014, 0.016, 0.005]} />
                            </mesh>
                          </group>
                        </group>
                      </group>

                      {/* 2. MIDDLE FINGER */}
                      <group ref={rMiddleMCPRef} position={[-0.006, -0.045, 0]}>
                        <mesh position={[0, -0.03, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.011, 0.010, 0.06, 12]} />
                        </mesh>
                      </group>

                      {/* 3. RING FINGER */}
                      <group ref={rRingMCPRef} position={[0.012, -0.045, 0]}>
                        <mesh position={[0, -0.028, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.010, 0.009, 0.055, 12]} />
                        </mesh>
                      </group>

                      {/* 4. PINKY FINGER */}
                      <group ref={rPinkyMCPRef} position={[0.028, -0.040, 0]}>
                        <mesh position={[0, -0.022, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.009, 0.008, 0.045, 12]} />
                        </mesh>
                      </group>

                      {/* 5. THUMB */}
                      <group ref={rThumbMCPRef} position={[-0.034, 0.015, 0.015]} rotation={[0, 0, Math.PI / 4]}>
                        <mesh position={[0, -0.02, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.011, 0.010, 0.04, 12]} />
                        </mesh>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* ================================================================= */}
        {/* LEFT ARM ARTICULATION (7-DOF Kinematic Chain) */}
        {/* ================================================================= */}
        <group ref={lClavicleRef} position={[-0.34, 0.82, 0.05]}>
          <group ref={lShoulderRef}>
            <mesh material={materials.whiteCeramic}>
              <sphereGeometry args={[0.13, 24, 24]} />
            </mesh>
            <mesh position={[-0.01, -0.16, 0]} material={materials.whiteCeramic}>
              <cylinderGeometry args={[0.075, 0.068, L1, 20]} />
            </mesh>

            {/* Elbow Hinge Joint */}
            <group ref={lElbowRef} position={[-0.01, -L1, 0]}>
              <mesh material={materials.brushedTitanium}>
                <sphereGeometry args={[0.075, 20, 20]} />
              </mesh>
              <group ref={lForearmTwistRef}>
                <mesh position={[0, -0.14, 0]} material={materials.whiteCeramic}>
                  <cylinderGeometry args={[0.065, 0.055, L2, 20]} />
                </mesh>

                {/* Wrist Joint (Carpal 2-Axis Gimbal) */}
                <group ref={lWristPitchRef} position={[0, -L2, 0]}>
                  <group ref={lWristYawRef}>
                    <mesh material={materials.brushedTitanium}>
                      <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
                    </mesh>

                    {/* Palm Chassis */}
                    <group ref={lHandRef} position={[0, -0.06, 0]}>
                      <mesh material={materials.darkCarbon}>
                        <boxGeometry args={[0.07, 0.08, 0.03]} />
                      </mesh>

                      {/* 1. INDEX FINGER */}
                      <group ref={lIndexMCPRef} position={[0.024, -0.045, 0]}>
                        <mesh position={[0, -0.025, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.011, 0.010, 0.05, 12]} />
                        </mesh>
                        <group ref={lIndexPIPRef} position={[0, -0.05, 0]}>
                          <mesh position={[0, -0.02, 0]} material={materials.brushedTitanium}>
                            <cylinderGeometry args={[0.010, 0.009, 0.04, 12]} />
                          </mesh>
                          <group ref={lIndexDIPRef} position={[0, -0.04, 0]}>
                            <mesh position={[0, -0.015, 0]} material={materials.whiteCeramic}>
                              <cylinderGeometry args={[0.009, 0.008, 0.03, 12]} />
                            </mesh>
                            <mesh position={[0, -0.025, 0.006]} material={materials.rubberPad}>
                              <boxGeometry args={[0.014, 0.016, 0.005]} />
                            </mesh>
                          </group>
                        </group>
                      </group>

                      {/* 2. MIDDLE FINGER */}
                      <group ref={lMiddleMCPRef} position={[0.006, -0.045, 0]}>
                        <mesh position={[0, -0.03, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.011, 0.010, 0.06, 12]} />
                        </mesh>
                      </group>

                      {/* 3. RING FINGER */}
                      <group ref={lRingMCPRef} position={[-0.012, -0.045, 0]}>
                        <mesh position={[0, -0.028, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.010, 0.009, 0.055, 12]} />
                        </mesh>
                      </group>

                      {/* 4. PINKY FINGER */}
                      <group ref={lPinkyMCPRef} position={[-0.028, -0.040, 0]}>
                        <mesh position={[0, -0.022, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.009, 0.008, 0.045, 12]} />
                        </mesh>
                      </group>

                      {/* 5. THUMB */}
                      <group ref={lThumbMCPRef} position={[0.034, 0.015, 0.015]} rotation={[0, 0, -Math.PI / 4]}>
                        <mesh position={[0, -0.02, 0]} material={materials.brushedTitanium}>
                          <cylinderGeometry args={[0.011, 0.010, 0.04, 12]} />
                        </mesh>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
