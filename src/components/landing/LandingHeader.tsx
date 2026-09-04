"use client";

import { useEffect, useState } from "react";
import { BrandLogoButton } from "@/components/landing/BrandLogoButton";
import {
  MapPinIcon,
  ZapIcon,
  PhoneIcon,
  CalendarIcon,
} from "@/components/ui/Icons";

const HEADER_LINKS = [
  { id: "doctor-bio", label: "About Doctor" },
  { id: "services", label: "Services & Fees" },
  { id: "schedule", label: "OPD Timings" },
  { id: "rx-preview", label: "Digital Rx" },
  { id: "location", label: "Clinic & Map" },
  { id: "faq", label: "FAQ" },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
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
    <>
      {/* Live Clinic Status Ticker */}
      <div className="clinic-ticker-bar">
        <div className="clinic-ticker-left">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <span className="status-dot" aria-hidden="true" />
            <strong style={{ color: "#ffffff" }}>CLINIC OPEN TODAY:</strong> 09:00 AM – 06:00 PM
          </span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <MapPinIcon style={{ width: 14, height: 14 }} /> Room 104, Shanti Medical Arcade
          </span>
        </div>
        <div className="clinic-ticker-right">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <ZapIcon style={{ width: 14, height: 14, color: "var(--accent-yellow)" }} /> Live OPD Wait: ~10 mins
          </span>
          <span style={{ opacity: 0.7 }}>•</span>
          <a
            href="tel:+919876543210"
            style={{ color: "var(--accent-yellow)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <PhoneIcon style={{ width: 14, height: 14 }} /> Emergency: +91 98765 43210
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
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

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "0.55rem 1.1rem", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
              onClick={() => {
                const el = document.getElementById("auth-box") || document.getElementById("schedule");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <CalendarIcon style={{ width: 16, height: 16 }} />
              Book Appointment
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export { scrollToSection, HEADER_LINKS };
