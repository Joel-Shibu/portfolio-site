"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    
    if (!cursor || !dot) return;

    // Move cursor with slight delay
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    // Add hover states
    const addHoverState = () => {
      gsap.to(cursor, {
        scale: 2.2,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderColor: "rgba(0, 0, 0, 0.3)",
        duration: 0.25,
      });
      gsap.to(dot, {
        scale: 0,
        duration: 0.25,
      });
    };

    const removeHoverState = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(0, 0, 0, 0.2)",
        duration: 0.25,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.25,
      });
    };

    // Attach listeners
    window.addEventListener("mousemove", moveCursor);

    // Attach hover effects to all clickable elements
    const attachHovers = () => {
      const clickables = document.querySelectorAll('a, button, input, [role="button"], .hover-target');
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", addHoverState);
        el.addEventListener("mouseleave", removeHoverState);
      });
    };

    // Initial attach and observe DOM changes
    attachHovers();
    
    const observer = new MutationObserver(() => {
      attachHovers();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
      const clickables = document.querySelectorAll('a, button, input, [role="button"], .hover-target');
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", addHoverState);
        el.removeEventListener("mouseleave", removeHoverState);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer ring */}
      <div 
        ref={cursorRef} 
        className="absolute top-0 left-0 w-8 h-8 rounded-full border border-white/50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
        style={{ willChange: "transform" }}
      />
      {/* Inner dot */}
      <div 
        ref={dotRef} 
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}