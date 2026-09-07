"use client";

import { useState, type ReactNode } from "react";
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
  CheckCircleIcon,
  ChevronDownIcon,
  InfoIcon,
} from "@/components/ui/Icons";

interface ServiceItem {
  title: string;
  desc: string;
  icon: ReactNode;
  fee: string;
  time: string;
  badge: string;
  highlights: string[];
}

const SERVICES: ServiceItem[] = [
  {
    title: "General Consultation",
    desc: "Comprehensive physical examination, accurate clinical diagnosis, and personalized treatment plans for acute fevers, infections, and common ailments.",
    icon: <StethoscopeIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹500 / $50",
    time: "20–30 mins",
    badge: "Most Popular",
    highlights: ["Complete vital checks", "Digital Rx included", "7-day follow-up slot"],
  },
  {
    title: "Diabetes & BP Management",
    desc: "Long-term metabolic regulation, continuous blood pressure titration, personalized diet protocols, and regular cardiovascular risk assessments.",
    icon: <ActivityIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹700 / $70",
    time: "30–45 mins",
    badge: "Chronic Care",
    highlights: ["HbA1c trend analysis", "Diet & lifestyle chart", "Medication review"],
  },
  {
    title: "Digital E-Prescriptions",
    desc: "Official tamper-proof PDF prescriptions with QR verification, explicit dosage intervals, and perpetual storage inside your patient portal.",
    icon: <FileTextIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "Included",
    time: "Instant Access",
    badge: "Paperless",
    highlights: ["NMC compliant format", "Pharmacy QR code", "Lifetime record history"],
  },
  {
    title: "Lab Report Analysis",
    desc: "In-depth review of diagnostic blood panels, lipid profiles, liver & kidney markers, thyroid tests, and ultrasound/X-ray imaging reports.",
    icon: <FlaskIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹400 / $40",
    time: "15–20 mins",
    badge: "Diagnostic",
    highlights: ["Second opinion reviews", "Plain-English explanation", "Targeted next steps"],
  },
  {
    title: "Pediatric & Family Care",
    desc: "Dedicated care for infants, adolescents, and seniors including routine immunizations, seasonal illness management, and developmental milestones.",
    icon: <BabyIcon style={{ width: 24, height: 24, color: "var(--accent-forest)" }} />,
    fee: "₹600 / $60",
    time: "25–30 mins",
    badge: "Family Health",
    highlights: ["Vaccination tracking", "Growth assessment", "Gentle pediatric care"],
  },
  {
    title: "Priority Walk-in Triage",
    desc: "Fast-track clinical evaluation for sudden high fevers, acute gastrointestinal distress, allergic reactions, and non-emergency urgent concerns.",
    icon: <SirenIcon style={{ width: 24, height: 24, color: "var(--accent-terracotta)" }} />,
    fee: "₹800 / $80",
    time: "Immediate",
    badge: "Fast Track",
    highlights: ["Zero wait queue", "Immediate bedside check", "Stabilization advice"],
  },
];

const OPD_SCHEDULE = [
  { day: "Monday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open", dayIndex: 1 },
  { day: "Tuesday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open", dayIndex: 2 },
  { day: "Wednesday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open", dayIndex: 3 },
  { day: "Thursday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open", dayIndex: 4 },
  { day: "Friday", morning: "09:00 AM – 01:00 PM", evening: "04:30 PM – 07:30 PM", status: "Open", dayIndex: 5 },
  { day: "Saturday", morning: "09:00 AM – 02:00 PM", evening: "On-Call Emergency", status: "Half Day", dayIndex: 6 },
  { day: "Sunday", morning: "Telehealth By Appointment", evening: "Closed (Emergency Only)", status: "Telehealth", dayIndex: 0 },
];

const FAQ_ITEMS = [
  {
    q: "How do I book an appointment with Dr. Shivansh?",
    a: "You can create an account or sign in above on our portal, choose your preferred in-clinic or telehealth slot, and receive an instant confirmation SMS & WhatsApp reminder with your OPD token number.",
  },
  {
    q: "Can I walk in directly without prior online booking?",
    a: "Yes! Walk-in patients are welcomed during both morning (09:00 AM – 01:00 PM) and evening (04:30 PM – 07:30 PM) OPD sessions. Online appointments receive priority token queuing to avoid waiting.",
  },
  {
    q: "How do digital prescriptions and medical records work?",
    a: "After your consultation, Dr. Shivansh generates a tamper-evident digital prescription with exact dosages, dietary advice, and follow-up notes. You can view, download, or share this PDF anytime from your secure patient dashboard.",
  },
  {
    q: "What payment methods and insurances are accepted at the clinic?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), all major credit/debit cards, net banking, and cash at our reception desk. We issue official itemized medical invoices for health insurance claims.",
  },
  {
    q: "Where is the clinic located and is parking available?",
    a: "Our clinic is at Room 104, 1st Floor, Shanti Medical Arcade, Civil Lines — directly opposite Central Park Metro Station (Gate 2). Free patient basement parking with elevator and wheelchair ramp access is available.",
  },
  {
    q: "How do I consult Dr. Shivansh for routine follow-ups?",
    a: "Routine follow-ups within 7 days of an initial consultation are discounted. You can book a quick follow-up slot online or schedule a secure 1-on-1 telehealth review through your dashboard.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Dr. Shivansh takes the time to listen, diagnose thoroughly, and explain everything clearly without rushing. His digital prescription system makes tracking my father's diabetes medications completely effortless.",
    author: "Rajesh K.",
    tag: "Hypertension & Diabetes",
    location: "Civil Lines, Delhi",
    initials: "RK",
  },
  {
    quote: "The clinic is remarkably calm and well-organized with zero chaotic waiting. Having immediate access to our past diagnostic records and prescriptions online was a lifesaver during our recent family travel.",
    author: "Ananya M.",
    tag: "Family Health Consultation",
    location: "Park Enclave",
    initials: "AM",
  },
  {
    quote: "Accurate diagnosis and very pragmatic, evidence-based advice. Dr. Shivansh never recommends unnecessary tests. Highly recommended for anyone seeking a trustworthy, patient-focused family physician.",
    author: "Dr. Vikram S.",
    tag: "Routine Health Screening",
    location: "Medical Enclave",
    initials: "VS",
  },
];

function RatingStars() {
  return (
    <div style={{ display: "flex", gap: "3px", color: "var(--accent-yellow)" }} aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} style={{ width: 16, height: 16 }} />
      ))}
    </div>
  );
}

export function LandingSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const currentDayOfWeek = new Date().getDay();

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="landing-sections">
      {/* -------------------------------------------------------- */}
      {/* Section 1: Doctor Profile & Clinical Credentials         */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop">
        <section id="doctor-bio" className="landing-section">
          <div className="doctor-profile-card">
            <div className="doctor-avatar-box">
              <div className="doctor-avatar-circle" aria-label="Dr. Shivansh A. Pandey">
                SP
              </div>
              <div>
                <h3 className="font-display" style={{ fontSize: "1.35rem", color: "var(--text-primary)", lineHeight: 1.2 }}>
                  Dr. Shivansh A. Pandey
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--accent-forest)", marginTop: "0.25rem", fontWeight: 700 }}>
                  MBBS • Consultant Physician
                </p>
                <p className="text-muted" style={{ fontSize: "0.75rem", marginTop: "0.15rem", fontWeight: 600 }}>
                  Family Medicine &amp; Preventive Health
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%", marginTop: "0.25rem" }}>
                <span className="clinic-stamp clinic-stamp--verified" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
                  <ShieldCheckIcon style={{ width: 13, height: 13 }} /> NMC Reg: MED-2024-8849
                </span>
                <span className="clinic-stamp" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
                  <AwardIcon style={{ width: 13, height: 13 }} /> 12+ Years Clinical Practice
                </span>
              </div>

              <div style={{ width: "100%", borderTop: "1.5px solid var(--border-subtle)", paddingTop: "0.85rem", marginTop: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Consultation Languages:
                </span>
                <div style={{ display: "flex", gap: "0.35rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <span className="opd-time-badge" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.45rem" }}>English</span>
                  <span className="opd-time-badge" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.45rem" }}>हिन्दी</span>
                  <span className="opd-time-badge" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.45rem" }}>Bhojpuri</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
              <div>
                <p className="section-tag">Clinical Background</p>
                <h2 className="section-title" style={{ marginTop: "0.25rem" }}>
                  Evidence-based, compassionate care for your entire family.
                </h2>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.65 }}>
                Dr. Shivansh A. Pandey (MBBS) combines over a decade of hands-on internal medicine and outpatient clinical expertise with a focus on preventive healthcare. His approach emphasizes active listening, minimal polypharmacy, transparent diagnostic reasoning, and seamless digital continuity of records.
              </p>

              <blockquote style={{ background: "var(--surface-cream)", borderLeft: "3.5px solid var(--accent-forest)", padding: "0.85rem 1.15rem", borderRadius: "0 8px 8px 0", fontSize: "0.9375rem", color: "var(--text-primary)", fontStyle: "italic", border: "1.5px solid var(--border-dark)", borderLeftWidth: "4px" }}>
                &ldquo;My philosophy is simple: diagnose the root cause with meticulous attention, explain every medication clearly, and empower patients through accessible digital health history.&rdquo;
              </blockquote>

              <div className="credentials-list">
                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", flexShrink: 0 }}>
                    <GraduationCapIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block", color: "var(--text-primary)" }}>MBBS Degree</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Premier Medical University</span>
                  </div>
                </div>

                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", flexShrink: 0 }}>
                    <AwardIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block", color: "var(--text-primary)" }}>Reg. No: MED-2024-8849</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>National Medical Commission</span>
                  </div>
                </div>

                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", flexShrink: 0 }}>
                    <BuildingIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block", color: "var(--text-primary)" }}>IMA Life Member</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Indian Medical Association</span>
                  </div>
                </div>

                <div className="credential-item">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", flexShrink: 0 }}>
                    <UsersIcon style={{ width: 18, height: 18, color: "var(--accent-forest)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", display: "block", color: "var(--text-primary)" }}>15,000+ Consultations</strong>
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
            <p className="section-tag section-tag--center">Clinical Services &amp; Fees</p>
            <h2 className="section-title section-title--center">
              Specialized Care &amp; Transparent Pricing
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Clear consultation rates with zero hidden charges. Every visit includes vital checks and official digital prescription records.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-card__header">
                  <div className="service-card__icon-box" aria-hidden="true">
                    {s.icon}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                    <span className="service-card__fee">{s.fee}</span>
                    <span className="clinic-stamp" style={{ fontSize: "0.625rem", padding: "0.15rem 0.4rem" }}>
                      {s.badge}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="service-card__title">{s.title}</h3>
                  <p className="service-card__desc" style={{ marginTop: "0.4rem" }}>{s.desc}</p>
                </div>

                {/* Feature highlights checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", background: "var(--surface-subtle)", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                  {s.highlights.map((h) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      <CheckCircleIcon style={{ width: 13, height: 13, color: "var(--accent-forest)", flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid var(--border-subtle)", paddingTop: "0.75rem", marginTop: "auto" }}>
                  <span className="service-card__badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <ClockIcon style={{ width: 14, height: 14 }} /> {s.time}
                  </span>
                  <a
                    href="#auth-box"
                    className="btn btn-secondary"
                    style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}
                  >
                    Book Slot →
                  </a>
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
            <p className="section-tag section-tag--center">OPD Timings &amp; Availability</p>
            <h2 className="section-title section-title--center">
              Doctor&apos;s Weekly Schedule
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Morning and evening clinical OPD sessions. Online booking secures a priority queue token.
            </p>
          </div>

          <div className="opd-schedule-card">
            {/* Live banner */}
            <div style={{ padding: "1.15rem 1.5rem", background: "var(--accent-forest)", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", display: "block" }}>
                    Dr. Shivansh Clinic • OPD Active
                  </strong>
                  <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Accepting Walk-ins &amp; Online Appointments
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8125rem", background: "rgba(255,255,255,0.18)", padding: "0.3rem 0.75rem", borderRadius: "6px", fontWeight: 700, border: "1px solid rgba(255,255,255,0.25)" }}>
                  Room 104 • OPD Department
                </span>
                <a
                  href="#auth-box"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", background: "#ffffff", color: "var(--accent-forest)", borderColor: "#ffffff" }}
                >
                  Reserve Today&apos;s Slot
                </a>
              </div>
            </div>

            <div className="opd-table-wrap">
              <table className="opd-table">
                <thead>
                  <tr>
                    <th>Day of Week</th>
                    <th>Morning Session</th>
                    <th>Evening Session</th>
                    <th>Clinic Status</th>
                  </tr>
                </thead>
                <tbody>
                  {OPD_SCHEDULE.map((slot) => {
                    const isToday = slot.dayIndex === currentDayOfWeek;
                    return (
                      <tr
                        key={slot.day}
                        style={{
                          backgroundColor: isToday ? "var(--surface-cream)" : undefined,
                          borderLeft: isToday ? "4px solid var(--accent-forest)" : undefined,
                        }}
                      >
                        <td className="opd-day-cell">
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span>{slot.day}</span>
                            {isToday && (
                              <span
                                className="clinic-stamp clinic-stamp--live"
                                style={{ fontSize: "0.625rem", padding: "0.15rem 0.4rem" }}
                              >
                                TODAY
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="opd-time-badge">{slot.morning}</span>
                        </td>
                        <td>
                          <span
                            className="opd-time-badge"
                            style={{
                              background: slot.evening.includes("Closed") ? "var(--surface-subtle)" : "var(--surface-cream)",
                              color: slot.evening.includes("Closed") ? "var(--text-muted)" : "var(--text-primary)",
                              borderColor: "var(--border-dark)",
                            }}
                          >
                            {slot.evening}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`clinic-stamp ${slot.status === "Open" ? "clinic-stamp--live" : ""}`}
                            style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}
                          >
                            {slot.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ padding: "0.85rem 1.5rem", background: "var(--surface-subtle)", borderTop: "1.5px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              <InfoIcon style={{ width: 16, height: 16, color: "var(--accent-forest)", flexShrink: 0 }} />
              <span>
                Walk-in token registration counter opens 15 minutes prior to each OPD session. Emergency cases are prioritized immediately.
              </span>
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
            <p className="section-tag section-tag--center">Official E-Prescriptions</p>
            <h2 className="section-title section-title--center">
              Real Clinical Records, Zero Paper Clutter
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Every prescription generated in CareVerse is digitally signed, NMC-compliant, tamper-evident, and perpetually preserved in your patient portal.
            </p>
          </div>

          <div className="rx-mockup-wrapper">
            <div className="rx-mockup-paper">
              <div className="rx-mockup-header">
                <div className="rx-doctor-info">
                  <h3>Dr. Shivansh A. Pandey</h3>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", marginTop: "0.15rem" }}>
                    MBBS • Consultant Physician &amp; Family Care Specialist
                  </p>
                  <p style={{ marginTop: "0.2rem" }}>Reg. No: NMC/MED-2024-8849 • State Medical Council</p>
                  <p style={{ marginTop: "0.15rem" }}>Shanti Medical Arcade, Civil Lines • Phone: +91 98765 43210</p>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                  <span className="clinic-stamp clinic-stamp--verified" style={{ fontSize: "0.6875rem" }}>
                    Official Digital Rx
                  </span>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    ID: RX-2024-98102
                  </p>
                  <span style={{ fontSize: "0.6875rem", background: "var(--surface-cream)", border: "1px solid var(--border-dark)", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 600 }}>
                    DISHA Compliant
                  </span>
                </div>
              </div>

              <div className="rx-patient-bar">
                <span>Patient: <strong>Rahul Sharma</strong></span>
                <span>Age / Sex: <strong>38 Y / Male</strong></span>
                <span>Consultation Date: <strong>Today (OPD)</strong></span>
                <span>BP: <strong>124/82 mmHg</strong></span>
                <span>Pulse: <strong>74 bpm</strong></span>
                <span>Weight: <strong>72 kg</strong></span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.75rem 0 0.5rem 0" }}>
                <div className="rx-symbol">℞</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontStyle: "italic", background: "var(--surface-subtle)", padding: "0.25rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                  Diagnosis: <strong>Primary Hypertension (Stage 1) &amp; Metabolic Review</strong>
                </div>
              </div>

              <table className="rx-med-table">
                <thead>
                  <tr>
                    <th>Medicine Name &amp; Strength</th>
                    <th>Dosage</th>
                    <th>Timing &amp; Instructions</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong style={{ color: "var(--text-primary)" }}>Tab. Metformin HCl 500mg</strong>
                      <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--text-muted)" }}>Oral • Sustained Release</span>
                    </td>
                    <td>500 mg</td>
                    <td>
                      <span className="opd-time-badge" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.4rem" }}>
                        1 - 0 - 1
                      </span>{" "}
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>After breakfast &amp; dinner</span>
                    </td>
                    <td>30 Days</td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ color: "var(--text-primary)" }}>Tab. Telmisartan 40mg</strong>
                      <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--text-muted)" }}>Oral • Blood Pressure Regulator</span>
                    </td>
                    <td>40 mg</td>
                    <td>
                      <span className="opd-time-badge" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.4rem" }}>
                        1 - 0 - 0
                      </span>{" "}
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Morning with water</span>
                    </td>
                    <td>30 Days</td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ color: "var(--text-primary)" }}>Cap. Vitamin D3 60,000 IU</strong>
                      <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--text-muted)" }}>Oral • Cholecalciferol</span>
                    </td>
                    <td>60k IU</td>
                    <td>
                      <span className="opd-time-badge" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.4rem", background: "var(--surface-cream)", color: "var(--text-primary)" }}>
                        1 Cap / Week
                      </span>{" "}
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Every Sunday after dinner</span>
                    </td>
                    <td>8 Weeks</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: "var(--surface-cream)", border: "1.5px solid var(--border-dark)", borderRadius: "8px", padding: "0.85rem 1.15rem", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.2rem" }}>
                  Doctor&apos;s Advice &amp; Lifestyle Plan:
                </strong>
                1. Maintain a low-sodium diet; restrict processed foods.<br />
                2. 30 minutes of brisk walking or light cardio daily.<br />
                3. Fasting blood sugar &amp; lipid profile review after 4 weeks. Follow-up consultation scheduled in 30 days.
              </div>

              <div className="rx-footer-stamp">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 700 }}>
                    <ShieldCheckIcon style={{ width: 14, height: 14, color: "var(--accent-forest)" }} /> Digitally Signed &amp; Timestamped
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                    Verified by CareVerse Cryptographic Hash • ID: 8940-RX-VERIFIED
                  </span>
                </div>
                <div className="rx-stamp-box">
                  CLINICALLY VERIFIED<br />
                  DR. SHIVANSH PANDEY, MBBS<br />
                  <span style={{ fontSize: "0.625rem", fontWeight: 600 }}>REG: MED-2024-8849</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* -------------------------------------------------------- */}
      {/* Section 5: Clinic Location & Direct Communication        */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={120}>
        <section id="location" className="landing-section">
          <div className="dual-section">
            <div className="glass-panel section-panel">
              <p className="section-tag">Physical Clinic Location</p>
              <h2 className="section-title">Visit Us In Person</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                Conveniently located in the city medical enclave with high accessibility, direct metro transit, and basement parking.
              </p>

              <div className="clinic-address-box">
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <BuildingIcon style={{ width: 20, height: 20, color: "var(--accent-forest)" }} />
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
                    <AccessibilityIcon style={{ width: 13, height: 13 }} /> Wheelchair &amp; Elevator
                  </span>
                  <span className="clinic-stamp" style={{ fontSize: "0.6875rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <TrainIcon style={{ width: 13, height: 13 }} /> Metro Gate 2 (200m)
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
              <h2 className="section-title">Reach Our Care Desk</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                Have questions before your visit? Our clinic reception desk is available during OPD hours for slot booking, insurance claims, and emergency assistance.
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
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Instant slot confirmations &amp; reminders</div>
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
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Diagnostic reports &amp; billing inquiries</div>
                  </div>
                </a>
              </div>

              <div style={{ marginTop: "auto", background: "var(--accent-terracotta-light)", border: "1.5px solid var(--accent-terracotta)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "var(--accent-terracotta-dark)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <SirenIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
                <span>
                  <strong>Emergency Hotline:</strong> For acute life-threatening situations, dial 108 / 112 or head to the nearest tertiary casualty room immediately.
                </span>
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
            <p className="section-tag section-tag--center">Patient Feedback &amp; Trust</p>
            <h2 className="section-title section-title--center">
              Real Care Experiences
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Rated 4.9 / 5.0 across over 15,000 in-person and digital patient consultations.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="testimonial-card">
                <RatingStars />
                <p className="testimonial-quote">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="testimonial-author">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", color: "var(--accent-forest)" }}>
                      {t.initials}
                    </div>
                    <div>
                      <strong style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", display: "block" }}>
                        {t.author}
                      </strong>
                      <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                        {t.location} • Verified Patient
                      </span>
                    </div>
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
      {/* Section 7: Interactive FAQ Accordion                     */}
      {/* -------------------------------------------------------- */}
      <ScrollReveal variant="pop" delay={160}>
        <section id="faq" className="landing-section">
          <div style={{ textAlign: "center" }}>
            <p className="section-tag section-tag--center">Frequently Asked Questions</p>
            <h2 className="section-title section-title--center">
              Everything You Need to Know
            </h2>
            <p className="section-subtitle" style={{ marginTop: "0.5rem" }}>
              Answers to common queries about slot reservations, digital records, payments, and clinic visits.
            </p>
          </div>

          <div className="faq-grid">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.q}
                  className="faq-item"
                  style={{
                    borderColor: isOpen ? "var(--accent-forest)" : "var(--border-dark)",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      padding: 0,
                    }}
                    aria-expanded={isOpen}
                  >
                    <h3 className="faq-item__q" style={{ marginBottom: 0 }}>
                      {item.q}
                    </h3>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: isOpen ? "var(--accent-forest)" : "var(--surface-subtle)",
                        color: isOpen ? "#ffffff" : "var(--text-primary)",
                        border: "1.5px solid var(--border-dark)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease, background 0.2s ease, color 0.2s ease",
                      }}
                    >
                      <ChevronDownIcon style={{ width: 16, height: 16 }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: "0.85rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem" }}>
                      <p className="faq-item__a">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

