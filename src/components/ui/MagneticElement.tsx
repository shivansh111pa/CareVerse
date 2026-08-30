"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function MagneticElement({
  children,
  className = "",
  intensity = 0.5,
}: MagneticElementProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const element = containerRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      // Only magnetic if close enough
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = width;

      if (distance < maxDistance) {
        gsap.to(element, {
          x: x * intensity,
          y: y * intensity,
          duration: 1,
          ease: "power3.out",
        });
      } else {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power3.out",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div ref={containerRef} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
