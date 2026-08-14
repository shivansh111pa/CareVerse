"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "pop" ? "scroll-reveal--pop" : "scroll-reveal--fade";

  const style: CSSProperties | undefined =
    delay > 0 ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${variantClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
