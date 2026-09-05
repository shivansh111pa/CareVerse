"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextMaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function TextMaskReveal({
  children,
  className = "",
  delay = 0,
}: TextMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textElement,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          delay: delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "hidden", display: "inline-flex" }}
    >
      <div ref={textRef} style={{ transform: "translateY(100%)" }}>
        {children}
      </div>
    </div>
  );
}
