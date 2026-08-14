"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { scrollToSection, HEADER_LINKS } from "@/components/landing/LandingHeader";

export function LandingFooter() {
  return (
    <ScrollReveal as="footer" className="landing-footer" variant="pop">
      <p className="landing-footer__label font-mono text-muted">Explore</p>
      <nav aria-label="Clinic information">
        <ul className="landing-footer__nav">
          {HEADER_LINKS.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                className="nav-chip"
                onClick={() => scrollToSection(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <p className="landing-footer__copy text-muted">
        © {new Date().getFullYear()} CareVerse · Dr. Shivansh A. Pandey, MBBS
      </p>
    </ScrollReveal>
  );
}
