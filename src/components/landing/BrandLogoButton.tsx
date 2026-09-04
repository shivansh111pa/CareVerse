"use client";

export function BrandLogoButton() {
  return (
    <button
      type="button"
      className="brand-glass"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="CareVerse Clinic — scroll to top"
    >
      <div className="brand-glass__icon-wrap">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Medical Cross & Stethoscope Icon */}
          <path d="M12 4v16m-8-8h16" />
        </svg>
      </div>
      <div className="brand-glass__text-group">
        <span className="brand-glass__text">CareVerse</span>
        <span className="brand-glass__tag">Dr. Shivansh Clinic</span>
      </div>
    </button>
  );
}
