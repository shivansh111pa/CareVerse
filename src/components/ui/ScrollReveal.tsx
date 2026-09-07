"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

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

export function ScrollReveal({
  children,
  className = "",
  as: Tag = "section",
  variant = "fade",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "pop" ? "scroll-reveal--pop" : "scroll-reveal--fade";

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${variantClass} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
