"use client";

import { useEffect, useState } from "react";
import { BrandLogoButton } from "@/components/landing/BrandLogoButton";
const HEADER_LINKS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "location", label: "Location" },
  { id: "hours", label: "Hours" },
  { id: "contact", label: "Contact" },
  { id: "faq", label: "FAQ" },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`landing-header${scrolled ? " landing-header--scrolled" : ""}`}
    >
      <div className="landing-header__inner">
        <BrandLogoButton />
        <nav className="landing-header__nav" aria-label="Page sections">
          {HEADER_LINKS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="header-link"
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export { scrollToSection, HEADER_LINKS };
