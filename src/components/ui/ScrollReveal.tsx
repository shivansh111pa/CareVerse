"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealVariant = "fade" | "pop";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** fade = rise + fade; pop = same bounce scale as auth panel */
  variant?: RevealVariant;
  /** Stagger delay in ms when section enters viewport */
  delay?: number;
}

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollReveal({
  children,
  className = "",
  as: Tag = "section",
  variant = "fade",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const ctx = gsap.context(() => {
      const vars: gsap.TweenVars = {
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        duration: 0.85,
        delay: delay / 1000,
        ease: "power3.out",
      };

      const fromVars: gsap.TweenVars = {
        opacity: 0
      };

      if (variant === "pop") {
        fromVars.y = 25;
        fromVars.scale = 0.97;
      } else {
        fromVars.y = 45;
      }

      gsap.fromTo(el, fromVars, vars);
    }, ref);

    return () => ctx.revert();
  }, [variant, delay]);

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal-init ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
