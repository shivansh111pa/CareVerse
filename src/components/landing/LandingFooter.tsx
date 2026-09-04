"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { scrollToSection, HEADER_LINKS } from "@/components/landing/LandingHeader";
import { BrandLogoButton } from "@/components/landing/BrandLogoButton";
import { PhoneIcon, ShieldCheckIcon, AwardIcon } from "@/components/ui/Icons";

export function LandingFooter() {
  return (
    <ScrollReveal as="footer" className="landing-footer" variant="pop">
      <div className="landing-footer__top">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "380px" }}>
          <BrandLogoButton />
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "0.5rem" }}>
            Comprehensive in-clinic consultations and digital healthcare management by Dr. Shivansh A. Pandey, MBBS.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
            <span className="clinic-stamp clinic-stamp--verified" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <ShieldCheckIcon style={{ width: 13, height: 13 }} /> NMC Reg: MED-2024-8849
            </span>
            <span className="clinic-stamp" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <AwardIcon style={{ width: 13, height: 13 }} /> ISO 9001:2015 Clinic
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p className="section-tag" style={{ fontSize: "0.75rem" }}>Clinic Sections</p>
          <ul className="landing-footer__nav">
            {HEADER_LINKS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.8125rem", padding: "0.4rem 0.8rem" }}
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "280px" }}>
          <p className="section-tag" style={{ fontSize: "0.75rem" }}>Emergency Helpline</p>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent-terracotta)", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <PhoneIcon style={{ width: 16, height: 16 }} /> +91 98765 43210
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            For life-threatening emergencies, please call 108/112 or visit the nearest hospital emergency room immediately.
          </p>
        </div>
      </div>

      <div className="landing-footer__bottom">
        <p>
          © {new Date().getFullYear()} CareVerse Clinic • Practice of Dr. Shivansh A. Pandey, MBBS. All rights reserved.
        </p>
        <p style={{ fontSize: "0.75rem" }}>
          Medical Confidentiality &amp; HIPAA/DISHA Compliant Records.
        </p>
      </div>
    </ScrollReveal>
  );
}
