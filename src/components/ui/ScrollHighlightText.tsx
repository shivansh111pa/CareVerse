"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollHighlightTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollHighlightText({ text, className = "", style }: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      // Direct opacity fallback
      const words = el.querySelectorAll(".highlight-word");
      gsap.set(words, { opacity: 1, color: "rgba(255, 255, 255, 1)" });
      return;
    }

    const words = el.querySelectorAll(".highlight-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15, color: "rgba(255, 255, 255, 0.15)" },
        {
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 58%",
            scrub: 0.15,
          },
          opacity: 1,
          color: "rgba(255, 255, 255, 1)",
          stagger: 0.05,
          ease: "none",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  const words = text.split(/\s+/);

  return (
    <span
      ref={containerRef}
      className={`scroll-highlight-text ${className}`.trim()}
      style={{
        display: "inline-block",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="highlight-word"
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            marginRight: "0.28em",
            opacity: 0.15,
            color: "rgba(255, 255, 255, 0.15)",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
