import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  // In a real app, fetch patient details using params.id
  const patient = {
    id: params.id,
    name: "Liam Nguyen",
    age: 34,
    gender: "Male",
    bloodType: "O+",
    height: "5'10\"",
    weight: "175 lbs",
    phone: "(555) 123-4567",
    email: "liam.n@example.com",
    address: "123 Main St, Anytown, CA",
  };

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href="/dashboard/doctor/patients" className="btn btn-ghost" style={{ padding: "0.5rem", borderRadius: "50%" }}>
          <svg style={{ width: "1.5rem", height: "1.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "2rem" }}>
            {patient.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{patient.name}</h1>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>ID: {patient.id} • {patient.age} yrs • {patient.gender}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", overflowX: "auto" }}>
        <button className="btn btn-ghost" style={{ padding: "0.75rem 0", color: "var(--text-bright)", borderBottom: "2px solid var(--accent-aqua)", borderRadius: 0, whiteSpace: "nowrap" }}>
          Overview
        </button>
        <button className="btn btn-ghost" style={{ padding: "0.75rem 0", color: "var(--text-muted)", borderRadius: 0, whiteSpace: "nowrap" }}>
          Appointments
        </button>
        <button className="btn btn-ghost" style={{ padding: "0.75rem 0", color: "var(--text-muted)", borderRadius: 0, whiteSpace: "nowrap" }}>
          Prescriptions
        </button>
        <button className="btn btn-ghost" style={{ padding: "0.75rem 0", color: "var(--text-muted)", borderRadius: 0, whiteSpace: "nowrap" }}>
          Vitals
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Patient Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Phone</div>
                <div style={{ fontSize: "0.875rem" }}>{patient.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email</div>
                <div style={{ fontSize: "0.875rem" }}>{patient.email}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Address</div>
                <div style={{ fontSize: "0.875rem" }}>{patient.address}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Blood Type</div>
                <div style={{ fontSize: "0.875rem" }}>{patient.bloodType}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Height / Weight</div>
                <div style={{ fontSize: "0.875rem" }}>{patient.height} / {patient.weight}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Allergies & Conditions</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255, 99, 132, 0.1)", color: "rgba(255, 99, 132, 1)", border: "1px solid rgba(255, 99, 132, 0.2)", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600 }}>Penicillin</span>
              <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "99px", fontSize: "0.75rem" }}>Hypertension</span>
              <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "99px", fontSize: "0.75rem" }}>Asthma (Mild)</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Recent Notes</h3>
              <button disabled className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>+ Add Note</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <span>Oct 14, 2024</span>
                  <span>Dr. Vance</span>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>Patient reports feeling generally well. Blood pressure is slightly elevated. Recommended continuing current medication and increasing cardio exercise to 3x/week.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
