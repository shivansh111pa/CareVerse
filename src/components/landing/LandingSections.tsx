import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";

const SERVICES = [
  {
    title: "General Consultation",
    desc: "Comprehensive check-ups and ongoing care for everyday health needs.",
    icon: "🩺",
  },
  {
    title: "Appointment Booking",
    desc: "Schedule visits online — pick a slot that fits your day.",
    icon: "📅",
  },
  {
    title: "Digital Records",
    desc: "Secure access to prescriptions, reports, and visit history.",
    icon: "📋",
  },
  {
    title: "Follow-up Care",
    desc: "Stay connected after your visit with reminders and updates.",
    icon: "💬",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I book an appointment?",
    a: "Sign up or log in on this page, then use the patient dashboard to pick an available slot.",
  },
  {
    q: "Is my health data secure?",
    a: "Yes — records are stored with encrypted access and role-based permissions.",
  },
  {
    q: "Can I get prescriptions online?",
    a: "Prescriptions and PDF downloads will be available in an upcoming module.",
  },
];

const STATS = [
  { value: "MBBS", label: "Qualified care" },
  { value: "24/7", label: "Online access" },
  { value: "100%", label: "Secure records" },
];

export function LandingSections() {
  return (
    <div className="landing-sections">
      <div className="stats-strip">
        {STATS.map((stat, i) => (
          <ScrollReveal key={stat.label} variant="pop" delay={i * 90} as="div">
            <div className="stat-card glass-panel">
              <span className="stat-card__value font-mono">{stat.value}</span>
              <span className="stat-card__label text-muted">{stat.label}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal variant="pop">
        <section id="about" className="landing-section">
          <GlassPanel variant="calm" className="section-panel">
            <p className="section-tag font-mono text-muted">About</p>
            <h2 className="section-title font-display">Your doctor, your digital clinic</h2>
            <ScrollHighlightText
              className="section-body text-muted"
              text="CareVerse is the online home of Dr. Shivansh A. Pandey, MBBS. We combine thoughtful in-person care with a calm, modern platform for appointments, records, and follow-ups — so managing your health feels straightforward, not overwhelming."
            />
          </GlassPanel>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="pop" delay={60}>
        <section id="services" className="landing-section">
          <p className="section-tag font-mono text-muted section-tag--center">Services</p>
          <h2 className="section-title font-display section-title--center">
            What we offer
          </h2>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={s.title} variant="pop" delay={120 + i * 80} as="div">
                <GlassPanel variant="calm" className="service-card">
                  <span className="service-card__icon" aria-hidden="true">
                    {s.icon}
                  </span>
                  <h3 className="service-card__title">{s.title}</h3>
                  <p className="service-card__desc text-muted">{s.desc}</p>
                </GlassPanel>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <div className="dual-section">
        <ScrollReveal variant="pop" delay={0} as="div" className="landing-section landing-section--half">
          <section id="location">
            <GlassPanel variant="calm" className="section-panel section-panel--tall">
              <p className="section-tag font-mono text-muted">Location</p>
              <h2 className="section-title font-display">Find the clinic</h2>
              <ScrollHighlightText
                className="section-body text-muted"
                text="Clinic address and map integration coming soon. For now, contact us directly to confirm directions and parking."
              />
              <div className="map-placeholder" aria-hidden="true">
                <span className="font-mono text-muted">Map preview</span>
              </div>
            </GlassPanel>
          </section>
        </ScrollReveal>

        <ScrollReveal variant="pop" delay={100} as="div" className="landing-section landing-section--half">
          <section id="hours">
            <GlassPanel variant="calm" className="section-panel section-panel--tall">
              <p className="section-tag font-mono text-muted">Clinic Hours</p>
              <h2 className="section-title font-display">When we&apos;re open</h2>
              <ul className="hours-list">
                {[
                  ["Mon – Fri", "9:00 AM – 6:00 PM"],
                  ["Saturday", "9:00 AM – 1:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, time]) => (
                  <li key={day} className="hours-list__row">
                    <span>{day}</span>
                    <span className="font-mono">{time}</span>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </section>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="pop">
        <section id="contact" className="landing-section">
          <GlassPanel variant="calm" className="section-panel section-panel--cta">
            <p className="section-tag font-mono text-muted">Contact</p>
            <h2 className="section-title font-display">Get in touch</h2>
            <ScrollHighlightText
              className="section-body text-muted"
              text="Full contact form and WhatsApp sharing arrive in a later module. For now, sign in to message your care team from the dashboard."
            />
            <div className="contact-chips">
              <span className="contact-chip font-mono">Email — coming soon</span>
              <span className="contact-chip font-mono">Phone — coming soon</span>
              <span className="contact-chip font-mono">WhatsApp — coming soon</span>
            </div>
          </GlassPanel>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="pop" delay={80}>
        <section id="faq" className="landing-section">
          <p className="section-tag font-mono text-muted section-tag--center">FAQ</p>
          <h2 className="section-title font-display section-title--center">
            Common questions
          </h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <ScrollReveal key={item.q} variant="pop" delay={140 + i * 70} as="div">
                <GlassPanel variant="calm" className="faq-item">
                  <h3 className="faq-item__q">{item.q}</h3>
                  <p className="faq-item__a text-muted">{item.a}</p>
                </GlassPanel>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
