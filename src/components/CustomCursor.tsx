"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";

function subscribePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // useSyncExternalStore is React 19 recommended pattern for media queries
  const hasFinePointer = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (!hasFinePointer) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    const addHoverState = () => {
      gsap.to(cursor, {
        scale: 1.8,
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderColor: "rgba(0, 0, 0, 0.25)",
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 0,
        duration: 0.2,
      });
    };

    const removeHoverState = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(0, 0, 0, 0.2)",
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
      });
    };

    // Lightweight event delegation: no DOM mutations observed, 0 CPU overhead
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, [role='button'], .hover-target")) {
        addHoverState();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, [role='button'], .hover-target")) {
        removeHoverState();
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Outer subtle ring */}
      <div 
        ref={cursorRef} 
        className="absolute top-0 left-0 w-8 h-8 rounded-full border border-neutral-700/40 -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      />
      {/* Inner precise dot */}
      <div 
        ref={dotRef} 
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-neutral-800 -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}