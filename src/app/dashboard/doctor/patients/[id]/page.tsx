import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const supabase = await createClient();
  let patientProfile = null;

  if (supabase) {
    const { data } = await supabase.from("profiles").select("*").eq("id", params.id).single();
    if (data) {
      patientProfile = data;
    }
  }

  if (!patientProfile) {
    return (
      <div className="dashboard-page">
        <h2>Patient not found.</h2>
        <Link href="/dashboard/doctor/patients">Back to Patients</Link>
      </div>
    );
  }

  const patient = {
    id: patientProfile.id,
    name: patientProfile.full_name || "Unknown Patient",
    age: "-",
    gender: "Not specified",
    bloodType: "Not specified",
    height: "Not specified",
    weight: "Not specified",
    phone: patientProfile.phone || "No phone on file",
    email: patientProfile.email || "No email on file",
    address: "Not specified",
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
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{patient.name}</h1>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>ID: {patient.id.substring(0,8)}... • {patient.age} yrs • {patient.gender}</p>
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
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No allergies recorded yet.</span>
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
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No clinical notes available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
