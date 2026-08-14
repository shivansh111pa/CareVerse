import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingSections } from "@/components/landing/LandingSections";
import { LiquidSurface } from "@/components/layout/LiquidSurface";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

function AuthPanelFallback() {
  return (
    <div className="auth-panel-wrap" aria-hidden="true">
      <div
        className="glass-panel glass-panel--auth pop-in-delayed"
        style={{
          width: "100%",
          maxWidth: 420,
          height: 420,
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
                <p className="font-mono text-muted hero-eyebrow">
                  Dr. Shivansh A. Pandey, MBBS
                </p>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={80} as="div">
                <h1 className="font-display hero-headline">
                  Your clinic,
                  <span className="hero-headline__accent"> connected</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={160} as="div">
                <p className="hero-sub text-muted">
                  Book appointments, manage records, and stay in touch with care
                  that feels as calm as it is capable.
                </p>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={220} as="div">
                <ul className="hero-features">
                  {[
                    "Online appointment booking",
                    "Secure patient records",
                    "Prescriptions & follow-ups",
                  ].map((item) => (
                    <li key={item} className="hero-features__item">
                      <span className="hero-features__dot" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal variant="pop" delay={300} as="div">
                <a href="#about" className="hero-scroll-hint font-mono text-muted">
                  Scroll to explore ↓
                </a>
              </ScrollReveal>
            </div>
            <Suspense fallback={<AuthPanelFallback />}>
              <AuthPanel />
            </Suspense>
          </div>
        </section>

        <LandingSections />
        <LandingFooter />
      </main>
    </>
  );
}
