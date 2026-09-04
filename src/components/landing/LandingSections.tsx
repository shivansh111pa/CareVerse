"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  StethoscopeIcon,
  ActivityIcon,
  FileTextIcon,
  FlaskIcon,
  BabyIcon,
  SirenIcon,
  ClockIcon,
  GraduationCapIcon,
  AwardIcon,
  BuildingIcon,
  UsersIcon,
  MapPinIcon,
  MapIcon,
  CarIcon,
  AccessibilityIcon,
  TrainIcon,
  PhoneIcon,
  WhatsAppIcon,
  MailIcon,
  StarIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

interface ServiceItem {
  title: string;
  desc: string;
  icon: ReactNode;
  fee: string;
  time: string;
  badge: string;
}

const SERVICES: ServiceItem[] = [
  {
    title: "General Consultation",
    desc: "Comprehensive check-up, clinical diagnosis, and personalized treatment plans for acute and chronic conditions.",
    icon: <StethoscopeIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹500 / $50",
    time: "20–30 mins",
    badge: "Most Popular",
  },
  {
    title: "Diabetes & BP Management",
    desc: "Long-term metabolic monitoring, blood pressure regulation, diet adjustments, and regular preventive reviews.",
    icon: <ActivityIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹700 / $70",
    time: "30–45 mins",
    badge: "Chronic Care",
  },
  {
    title: "Digital E-Prescriptions",
    desc: "Instant tamper-proof PDF prescriptions with dosage schedules and QR verification, saved in your patient portal.",
    icon: <FileTextIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "Included",
    time: "Instant Access",
    badge: "Paperless",
  },
  {
    title: "Lab Report Analysis",
    desc: "In-depth review of blood tests, lipid profiles, thyroid panels, and radiological scans with clear explanations.",
    icon: <FlaskIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹400 / $40",
    time: "15–20 mins",
    badge: "Diagnostic",
  },
  {
    title: "Pediatric & Family Health",
    desc: "Routine vaccinations, developmental growth milestones, seasonal illness treatment, and adolescent care.",
    icon: <BabyIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹600 / $60",
    time: "25–30 mins",
    badge: "Family Care",
  },
  {
    title: "Priority Walk-in Triage",
    desc: "Immediate clinical assessment for acute fevers, sudden allergic reactions, and urgent non-ICU health concerns.",
    icon: <SirenIcon style={{ width: 24, height: 24, color: "var(--accent-terracotta)" }} />,
    fee: "₹800 / $80",
    time: "Immediate",
    badge: "Fast Track",
  },
];

const OPD_SCHEDULE = [
  { day: "Monday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open" },
  { day: "Tuesday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open" },
  { day: "Wednesday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open" },
  { day: "Thursday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open" },
  { day: "Friday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open" },
  { day: "Saturday", morning: "09:00 AM – 02:00 PM", evening: "Emergency On-Call", status: "Half Day" },
  { day: "Sunday", morning: "Telehealth by Slot", evening: "Closed (Emergency Only)", status: "Telehealth" },
];

const FAQ_ITEMS = [
  {
    q: "How do I book an appointment with Dr. Shivansh?",
    a: "You can sign up on our portal above, choose your preferred in-clinic or telehealth slot, and receive an instant SMS & WhatsApp confirmation with your token number.",
  },
  {
    q: "Can I walk in without an online appointment?",
    a: "Yes, walk-ins are welcomed during morning (9:00 AM – 1:00 PM) and evening (4:30 PM – 7:30 PM) OPD hours. Online appointments receive priority slot queuing.",
  },
  {
    q: "How do digital prescriptions and medical records work?",
    a: "After your consultation, Dr. Shivansh issues a digitally signed e-prescription with full dosage instructions. You can download the PDF anytime from your secure patient dashboard.",
  },
  {
    q: "What payment methods and insurances are accepted?",
    a: "We accept UPI, all major credit/debit cards, net banking, cash at the clinic desk, and provide itemized medical bills for insurance reimbursement.",
  },
  {
    q: "Is there parking available at the clinic?",
    a: "Yes, free patient parking with wheelchair accessibility is available in the Shanti Medical Arcade basement.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Dr. Shivansh takes the time to listen and explain everything clearly. His digital prescription system makes keeping track of my father's diabetes medications so easy.",
    author: "Rajesh K.",
    tag: "Hypertension & Diabetes Follow-up",
  },
  {
    quote: "The clinic is well-organized with zero chaotic waiting. Having access to past consultation records online saved us during an emergency.",
    author: "Ananya M.",
    tag: "Family Health Consultation",
  },
  {
    quote: "Accurate diagnosis and very pragmatic advice. No unnecessary tests prescribed. Highly recommend Dr. Shivansh to anyone looking for a dependable physician.",
    author: "Dr. Vikram S.",
    tag: "Routine Health Screening",
  },
];

function RatingStars() {
  return (
    <div style={{ display: "flex", gap: "2px", color: "var(--accent-yellow)" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} style={{ width: 16, height: 16 }} />
      ))}
    </div>
  );
}

export function LandingSections() {
  return (
    <div className="landing-sections">
      {/* -------------------------------------------------------- */}
      {/* Section 1: Doctor Profile & Credentials                  */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop">
        <section id="doctor-bio" className="landing-section">
          <div className="doctor-profile-card">
            <div className="doctor-avatar-box">
              <div className="doctor-avatar-circle" aria-label="Dr. Shivansh A. Pandey">
                SP
              </div>
              <div>
                <h3 className="font-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                  Dr. Shivansh A. Pandey
                </h3>
                <p className="text-muted" style={{ fontSize: "0.8125rem", marginTop: "0.2rem", fontWeight: 600 }}>
                  MBBS • Consultant Physician
                </p>
              </div>
              <span className="clinic-stamp clinic-stamp--verified" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <ShieldCheckIcon style={{ width: 13, height: 13 }} /> NMC Registered
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p className="section-tag">About The Doctor</p>
              <h2 className="section-title">
                Dedicated to evidence-based, compassionate medical care.
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
                Dr. Shivansh A. Pandey (MBBS) brings over a decade of clinical experience in family medicine, internal care, and preventive health. His practice balances meticulous diagnostic evaluations with modern digital health records — empowering patients to take confident control of their well-being.
              </p>

              <div className="credentials-list">
                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "var(--accent-forest-light)", flexShrink: 0 }}>
                    <GraduationCapIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block" }}>MBBS Degree</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Premier Medical University</span>
                  </div>
                </div>
                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "var(--accent-forest-light)", flexShrink: 0 }}>
                    <AwardIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block" }}>Reg. No: MED-2024-8849</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>National Medical Commission</span>
                  </div>
                </div>
                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "var(--accent-forest-light)", flexShrink: 0 }}>
                    <BuildingIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block" }}>IMA Member</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Indian Medical Association</span>
                  </div>
                </div>
                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "var(--accent-forest-light)", flexShrink: 0 }}>
                    <UsersIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block" }}>15,000+ Consults</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Trusted Family Physician</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 2: Clinical Services & Fee Menu                  */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={40}>
        <section id="services" className="landing-section">
          <div style={{ textAlign: "center" }}>
            <p className="section-tag section-tag--center">Clinical Services</p>
            <h2 className="section-title section-title--center">
              Specialized Care &amp; Transparent Pricing
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              No hidden fees. Transparent consultation rates for in-clinic visits, preventive diagnostics, and ongoing family healthcare.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-card__header">
                  <div className="service-card__icon-box" aria-hidden="true">
                    {s.icon}
                  </div>
                  <span className="service-card__fee">{s.fee}</span>
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid var(--border-subtle)", paddingTop: "0.75rem", marginTop: "auto" }}>
                  <span className="service-card__badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <ClockIcon style={{ width: 13, height: 13 }} /> {s.time}
                  </span>
                  <span className="clinic-stamp" style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}>
                    {s.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 3: Interactive OPD Schedule Matrix               */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={80}>
        <section id="schedule" className="landing-section">
          <div style={{ textAlign: "center" }}>
            <p className="section-tag section-tag--center">OPD Timings</p>
            <h2 className="section-title section-title--center">
              Doctor&apos;s Weekly Schedule
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Book an appointment during regular OPD hours or walk into our clinic.
            </p>
          </div>

          <div className="opd-schedule-card">
            <div style={{ padding: "1.25rem 1.5rem", background: "var(--accent-forest)", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="status-dot" aria-hidden="true" />
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem" }}>
                  Currently In-Clinic • Accepting Patients
                </strong>
              </div>
              <span style={{ fontSize: "0.8125rem", background: "rgba(255,255,255,0.15)", padding: "0.3rem 0.75rem", borderRadius: "6px", fontWeight: 600 }}>
                Room 104 • OPD Department
              </span>
            </div>

            <div className="opd-table-wrap">
              <table className="opd-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Morning Session</th>
                    <th>Evening Session</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {OPD_SCHEDULE.map((slot) => (
                    <tr key={slot.day}>
                      <td className="opd-day-cell">{slot.day}</td>
                      <td>
                        <span className="opd-time-badge">{slot.morning}</span>
                      </td>
                      <td>
                        <span className="opd-time-badge" style={{ background: "var(--surface-cream)", color: "var(--text-primary)", borderColor: "var(--border-dark)" }}>
                          {slot.evening}
                        </span>
                      </td>
                      <td>
                        <span className={`clinic-stamp ${slot.status === "Open" ? "clinic-stamp--live" : ""}`} style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}>
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 4: Realistic Digital Prescription (Rx) Preview   */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={100}>
        <section id="rx-preview" className="landing-section">
          <div style={{ textAlign: "center" }}>
            <p className="section-tag section-tag--center">Digital Prescriptions</p>
            <h2 className="section-title section-title--center">
              Real Medical Records, Zero Paper Clutter
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Every prescription generated in CareVerse is tamper-evident, digitally signed, and instantly accessible to patients and pharmacies.
            </p>
          </div>

          <div className="rx-mockup-wrapper">
            <div className="rx-mockup-paper">
              <div className="rx-mockup-header">
                <div className="rx-doctor-info">
                  <h3>Dr. Shivansh A. Pandey</h3>
                  <p>MBBS • Reg No. MED-2024-8849</p>
                  <p style={{ marginTop: "0.2rem" }}>Shanti Medical Arcade, Civil Lines</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="clinic-stamp clinic-stamp--verified" style={{ fontSize: "0.6875rem" }}>
                    Official E-Prescription
                  </span>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem", fontWeight: 600 }}>
                    ID: RX-2024-98102
                  </p>
                </div>
              </div>

              <div className="rx-patient-bar">
                <span>Patient: <strong>Rahul Sharma</strong></span>
                <span>Age/Sex: <strong>38 / M</strong></span>
                <span>Date: <strong>Today</strong></span>
                <span>BP: <strong>120/80 mmHg</strong></span>
                <span>Weight: <strong>72 kg</strong></span>
              </div>

              <div className="rx-symbol">℞</div>

              <table className="rx-med-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Tab. Metformin 500mg</strong></td>
                    <td>500 mg</td>
                    <td>1 - 0 - 1 (After Meals)</td>
                    <td>30 Days</td>
                  </tr>
                  <tr>
                    <td><strong>Tab. Telmisartan 40mg</strong></td>
                    <td>40 mg</td>
                    <td>1 - 0 - 0 (Morning)</td>
                    <td>30 Days</td>
                  </tr>
                  <tr>
                    <td><strong>Cap. Vitamin D3 60,000 IU</strong></td>
                    <td>60k IU</td>
                    <td>1 Cap / Week (Sunday)</td>
                    <td>8 Weeks</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: "var(--surface-cream)", border: "1.5px solid var(--border-dark)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                <strong>Doctor&apos;s Advice:</strong> Maintain low-sodium diet, 30 minutes brisk walking daily, check fasting blood sugar weekly. Follow up in 30 days.
              </div>

              <div className="rx-footer-stamp">
                <div>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 600 }}>
                    <ShieldCheckIcon style={{ width: 14, height: 14, color: "var(--accent-forest)" }} /> Digitally Verified by Dr. Shivansh A. Pandey
                  </span>
                </div>
                <div className="rx-stamp-box">
                  CLINICALLY VERIFIED<br />
                  DR. SHIVANSH PANDEY, MBBS
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 5: Clinic Location & Contact                     */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={120}>
        <section id="location" className="landing-section">
          <div className="dual-section">
            <div className="glass-panel section-panel">
              <p className="section-tag">Physical Clinic Location</p>
              <h2 className="section-title">Visit Us In Person</h2>
              <div className="clinic-address-box">
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <BuildingIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  <h4>Dr. Shivansh Clinic</h4>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                  Room 104, 1st Floor, Shanti Medical Arcade,<br />
                  Opp. Central Park Metro Station (Gate 2),<br />
                  Civil Lines, Medical Enclave.
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <span className="clinic-stamp" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <CarIcon style={{ width: 13, height: 13 }} /> Free Valet Parking
                  </span>
                  <span className="clinic-stamp" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <AccessibilityIcon style={{ width: 13, height: 13 }} /> Wheelchair Accessible
                  </span>
                  <span className="clinic-stamp" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <TrainIcon style={{ width: 13, height: 13 }} /> Metro 200m
                  </span>
                </div>
              </div>

              <div className="map-preview-card">
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)" }}>
                  <MapIcon style={{ width: 26, height: 26 }} />
                </div>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                  Central Park Metro &amp; Shanti Arcade Map
                </strong>
                <p className="text-muted" style={{ fontSize: "0.8125rem" }}>
                  Easy connectivity from all central city routes.
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.8125rem", padding: "0.45rem 0.9rem" }}
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            <div id="contact" className="glass-panel section-panel">
              <p className="section-tag">Direct Communication</p>
              <h2 className="section-title">Reach Our Care Team</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                Have questions before your visit? Our clinic reception desk is available during OPD hours for slot booking, insurance queries, and emergency support.
              </p>

              <div className="contact-quick-buttons">
                <a
                  href="tel:+919876543210"
                  className="btn btn-primary"
                  style={{ justifyContent: "flex-start", padding: "0.85rem 1.25rem", gap: "0.85rem" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <PhoneIcon style={{ width: 16, height: 16 }} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700 }}>Direct Reception: +91 98765 43210</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.85, fontWeight: 400 }}>Mon–Sat: 09:00 AM – 07:30 PM</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: "flex-start", padding: "0.85rem 1.25rem", gap: "0.85rem" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#166534" }}>
                    <WhatsAppIcon style={{ width: 16, height: 16 }} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700 }}>WhatsApp Care Desk</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Instant slot confirmation &amp; reminders</div>
                  </div>
                </a>

                <a
                  href="mailto:clinic@careverse.health"
                  className="btn btn-secondary"
                  style={{ justifyContent: "flex-start", padding: "0.85rem 1.25rem", gap: "0.85rem" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--accent-forest)" }}>
                    <MailIcon style={{ width: 16, height: 16 }} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700 }}>clinic@careverse.health</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Reports &amp; administrative inquiries</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 6: Verified Patient Testimonials                 */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={140}>
        <section className="landing-section">
          <div style={{ textAlign: "center" }}>
            <p className="section-tag section-tag--center">Patient Feedback</p>
            <h2 className="section-title section-title--center">
              Real Care Experiences
            </h2>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="testimonial-card">
                <RatingStars />
                <p className="testimonial-quote">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="testimonial-author">
                  <div>
                    <strong style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem" }}>
                      {t.author}
                    </strong>
                    <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                      Verified Patient
                    </span>
                  </div>
                  <span className="clinic-stamp" style={{ fontSize: "0.625rem", padding: "0.2rem 0.4rem" }}>
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 7: FAQ                                           */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={160}>
        <section id="faq" className="landing-section">
          <div style={{ textAlign: "center" }}>
            <p className="section-tag section-tag--center">Frequently Asked Questions</p>
            <h2 className="section-title section-title--center">
              Everything You Need to Know
            </h2>
          </div>

          <div className="faq-grid">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="faq-item">
                <h3 className="faq-item__q">{item.q}</h3>
                <p className="faq-item__a">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
