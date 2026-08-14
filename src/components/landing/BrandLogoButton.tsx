"use client";

import { useLiquidGlassSpotlight } from "@/hooks/useLiquidGlassSpotlight";

export function BrandLogoButton() {
  const { ref, handlers } = useLiquidGlassSpotlight<HTMLButtonElement>(
    "brand-glass--active"
  );

  return (
    <button
      ref={ref}
      type="button"
      className="brand-glass glass-panel--auth pop-in-delayed liquid-glass"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...handlers}
      onFocus={handlers.onMouseEnter}
      onBlur={handlers.onMouseLeave}
      aria-label="CareVerse — scroll to top"
    >
      <span className="liquid-glass__spotlight" aria-hidden="true" />
      <span className="brand-glass__shine" aria-hidden="true" />
      <span className="brand-glass__content">
        <svg
          className="brand-glass__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M8 6v6.5a6 6 0 0 0 12 0V9" />
          <path d="M20 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
          <path d="M20 11.5v1a3.5 3.5 0 0 1-7 0v-1" />
        </svg>
        <span className="brand-glass__text font-display">CareVerse</span>
      </span>
    </button>
  );
}
