"use client";

import { useRef, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number;
  scale?: number;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className = "",
  maxRotation = 8,
  scale = 1.02,
  style,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    const tiltX = -relativeY * maxRotation;
    const tiltY = relativeX * maxRotation;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <div style={{ transform: "translateZ(12px)", height: "100%", width: "100%", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
