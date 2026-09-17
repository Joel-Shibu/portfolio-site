"use client";

import { useEffect } from "react";
import { registerGSAP } from "@/lib/animations/gsap-setup";

export function GSAPInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGSAP();
  }, []);
  return <>{children}</>;
}