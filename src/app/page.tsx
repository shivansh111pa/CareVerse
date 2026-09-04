import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingSections } from "@/components/landing/LandingSections";
import { LiquidSurface } from "@/components/layout/LiquidSurface";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  StarIcon,
} from "@/components/ui/Icons";

function AuthPanelFallback() {
  return (
    <div className="auth-panel-wrap" aria-hidden="true">
      <div
        className="glass-panel glass-panel--auth"
        style={{
          width: "100%",
          maxWidth: 440,
          minHeight: 460,
          padding: "1.75rem",
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <LiquidSurface />
      <LandingHeader />
      <main className="page-shell">
        <section className="landing-hero">
          <div className="landing-grid">
            <div className="hero-copy">
              <ScrollReveal variant="pop" delay={0} as="div">
                <div className="doctor-badge-strip">
                  <span className="clinic-stamp clinic-stamp--verified" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <ShieldCheckIcon style={{ width: 13, height: 13 }} /> NMC Reg: MED-2024-8849
                  </span>
                  <span className="clinic-stamp">
                    Dr. Shivansh A. Pandey, MBBS
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={60} as="div">
                <h1 className="font-display hero-headline">
                  Thoughtful healthcare,
                  <span className="hero-headline__accent"> grounded in trust.</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={120} as="div">
                <p className="hero-sub">
                  Experience seamless clinic visits, digital prescriptions, and direct doctor follow-ups. Whether in-person at our clinic or via telehealth, your health is in expert hands.
                </p>
              </ScrollReveal>

              {/* Doctor Trust Counters */}
              <ScrollReveal variant="pop" delay={180} as="div">
                <div className="hero-stats-row">
                  <div className="hero-stat-box">
                    <div className="hero-stat-box__val">12+ Yrs</div>
                    <div className="hero-stat-box__lbl">Clinical Practice</div>
                  </div>
                  <div className="hero-stat-box">
                    <div className="hero-stat-box__val">15,000+</div>
                    <div className="hero-stat-box__lbl">Patients Treated</div>
                  </div>
                  <div className="hero-stat-box">
                    <div className="hero-stat-box__val" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      4.9 <StarIcon style={{ width: 18, height: 18, color: "var(--accent-yellow)" }} />
                    </div>
                    <div className="hero-stat-box__lbl">Patient Trust</div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Key Features Checklist */}
              <ScrollReveal variant="pop" delay={240} as="div">
                <ul className="hero-features">
                  {[
                    "Guaranteed OPD time slots — Zero waiting in queues",
                    "Official digital prescriptions with QR code verification",
                    "Secure lab reports & medical history portal",
                  ].map((item) => (
                    <li key={item} className="hero-features__item">
                      <span className="hero-features__icon" aria-hidden="true">
                        <CheckCircleIcon style={{ width: 14, height: 14 }} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={300} as="div">
                <div className="hero-cta-group">
                  <a href="#schedule" className="btn btn-primary">
                    View Clinic Timings
                  </a>
                  <a href="#doctor-bio" className="btn btn-secondary">
                    Doctor Profile & Bio
                  </a>
                </div>
              </ScrollReveal>
            </div>

            <div id="auth-box" style={{ width: "100%", maxWidth: "440px", margin: "0 auto" }}>
              <Suspense fallback={<AuthPanelFallback />}>
                <AuthPanel />
              </Suspense>
            </div>
          </div>
        </section>

        <LandingSections />
        <LandingFooter />
      </main>
    </>
  );
}
