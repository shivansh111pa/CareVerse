"use client";

import { useEffect, useRef } from "react";

interface LiquidSurfaceProps {
  /** Slower/near-static animation for data-heavy screens */
  calm?: boolean;
}

export function LiquidSurface({ calm = false }: LiquidSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      container.style.setProperty("--parallax-x", `${x}deg`);
      container.style.setProperty("--parallax-y", `${y}deg`);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`liquid-surface${calm ? " liquid-surface--calm" : ""}`}
      aria-hidden="true"
      style={{
        transform:
          "perspective(900px) rotateX(var(--parallax-y, 0deg)) rotateY(var(--parallax-x, 0deg))",
        transition: "transform 0.6s ease-out",
      }}
    >
      <div className="liquid-blob liquid-blob--1" />
      <div className="liquid-blob liquid-blob--2" />
      <div className="liquid-blob liquid-blob--3" />
      <div className="liquid-blob liquid-blob--4" />

      {/* Medical-themed ambient layer */}
      <div className="medical-bg">
        <div className="medical-bg__grid" />

        <svg className="medical-bg__ecg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            className="medical-bg__ecg-line"
            d="M0,60 L80,60 L100,60 L115,35 L130,85 L145,20 L160,95 L175,60 L200,60 L280,60 L300,60 L315,45 L330,75 L345,55 L360,60 L440,60 L460,60 L475,30 L490,90 L505,25 L520,88 L535,60 L620,60 L640,60 L655,40 L670,80 L685,50 L700,60 L780,60 L800,60 L815,38 L830,82 L845,48 L860,60 L940,60 L960,60 L975,42 L990,78 L1005,52 L1020,60 L1200,60"
          />
        </svg>

        <svg className="medical-bg__ecg medical-bg__ecg--upper" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path
            className="medical-bg__ecg-line medical-bg__ecg-line--slow"
            d="M0,40 L120,40 L140,40 L155,28 L170,52 L185,22 L200,58 L215,40 L320,40 L340,40 L358,32 L375,48 L392,40 L500,40 L520,40 L538,26 L555,54 L572,40 L680,40 L700,40 L718,30 L735,50 L752,40 L860,40 L880,40 L898,24 L915,56 L932,40 L1200,40"
          />
        </svg>

        <div className="medical-bg__glyph medical-bg__glyph--1">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M32 54c12-8 20-18 20-30a12 12 0 1 0-24 0c0 12 8 22 20 30z" />
            <path d="M32 28v8M28 32h8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="medical-bg__glyph medical-bg__glyph--2">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="20" cy="38" r="14" />
            <path d="M34 38h22M46 38v-8a8 8 0 0 0-8-8" strokeLinecap="round" />
            <path d="M46 30v16" strokeLinecap="round" />
          </svg>
        </div>

        <div className="medical-bg__glyph medical-bg__glyph--3">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="18" y="26" width="28" height="12" rx="6" />
            <line x1="24" y1="32" x2="40" y2="32" strokeLinecap="round" />
            <path d="M32 26V18M28 18h8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="medical-bg__glyph medical-bg__glyph--4">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M32 12v40M12 32h40" strokeLinecap="round" />
            <circle cx="32" cy="32" r="22" opacity="0.5" />
          </svg>
        </div>

        <div className="medical-bg__glyph medical-bg__glyph--5">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 48c8-16 24-16 32 0" />
            <path d="M20 48c6-10 18-10 24 0" opacity="0.6" />
            <ellipse cx="32" cy="20" rx="6" ry="8" />
            <path d="M32 28v12" />
          </svg>
        </div>

        <div className="medical-bg__dna">
          <div className="dna-helix">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="dna-rung"
                style={{
                  transform: `rotateY(${i * 18}deg) translateY(${i * 12}px) translateZ(0)`,
                }}
              >
                <div className="dna-dot dna-dot--left" />
                <div className="dna-line" />
                <div className="dna-dot dna-dot--right" />
              </div>
            ))}
          </div>
        </div>

        <div className="medical-bg__pulse" />
        <div className="medical-bg__pulse medical-bg__pulse--2" />
      </div>
    </div>
  );
}
