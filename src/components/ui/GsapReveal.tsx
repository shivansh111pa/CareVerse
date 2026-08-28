"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

interface GsapRevealProps {
  children: ReactNode;
  stagger?: number;
  duration?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export function GsapReveal({
  children,
  stagger = 0.1,
  duration = 0.8,
  delay = 0,
  direction = "up",
  className = "",
  style,
}: GsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for prefers-reduced-motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const targets = containerRef.current.children;
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      const vars: gsap.TweenVars = {
        opacity: 1,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power4.out",
      };

      const fromVars: gsap.TweenVars = {
        opacity: 0
      };

      if (direction === "up") fromVars.y = 30;
      else if (direction === "down") fromVars.y = -30;
      else if (direction === "left") fromVars.x = 30;
      else if (direction === "right") fromVars.x = -30;

      gsap.fromTo(targets, fromVars, vars);
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, duration, delay, direction]);

  return (
    <div ref={containerRef} className={`gsap-reveal-init ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
