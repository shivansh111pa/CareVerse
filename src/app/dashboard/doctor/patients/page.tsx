import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PatientsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const supabase = await createClient();
  let patients: any[] = [];

  if (supabase) {
    const { data: appointments } = await supabase
      .from("appointments")
      .select(`
        patient_id,
        start_time,
        profiles!appointments_patient_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq("doctor_id", profile.id)
      .order("start_time", { ascending: false });

    if (appointments) {
      // Deduplicate by patient_id
      const patientMap = new Map();
      appointments.forEach((appt: any) => {
        if (!appt.profiles) return;
        
        if (!patientMap.has(appt.patient_id)) {
          patientMap.set(appt.patient_id, {
            id: appt.profiles.id,
            name: appt.profiles.full_name || "Unknown Patient",
            age: "-", // Age not implemented in profile schema yet
            email: appt.profiles.email || "No email",
            phone: appt.profiles.phone || "No phone",
            lastVisit: new Date(appt.start_time) < new Date() ? new Date(appt.start_time).toLocaleDateString() : "None",
            nextAppt: new Date(appt.start_time) >= new Date() ? new Date(appt.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "None",
            _latestAppt: new Date(appt.start_time)
          });
        } else {
          // Update lastVisit / nextAppt logic if needed
          const p = patientMap.get(appt.patient_id);
          const apptDate = new Date(appt.start_time);
          const now = new Date();
          
          if (apptDate < now && (p.lastVisit === "None" || apptDate > new Date(p.lastVisit))) {
            p.lastVisit = apptDate.toLocaleDateString();
          }
          if (apptDate >= now && (p.nextAppt === "None" || apptDate < new Date(p._latestAppt))) {
            p.nextAppt = apptDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            p._latestAppt = apptDate;
          }
        }
      });
      patients = Array.from(patientMap.values());
    }
  }

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Patient Directory
          </h1>
          <p className="text-muted dashboard-page__lead">
            Manage your patients and view their medical history.
          </p>
        </div>
        
        {/* Search & Add Patient */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ position: "relative", width: "100%", minWidth: "250px" }}>
            <input 
              type="text" 
              placeholder="Search patients by name..." 
              className="glass-input" 
              style={{ paddingLeft: "2.5rem", borderRadius: "99px" }} 
              disabled 
            />
            <svg style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button disabled className="btn" style={{ padding: "0.5rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", whiteSpace: "nowrap" }}>
            + Add Patient
          </button>
        </div>
      </header>

      {/* Patient List */}
      <div className="glass-panel" style={{ padding: "0" }}>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500, fontSize: "0.875rem" }}>Patient</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500, fontSize: "0.875rem" }}>Contact Info</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500, fontSize: "0.875rem" }}>Last Visit</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500, fontSize: "0.875rem" }}>Next Appointment</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500, fontSize: "0.875rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No patients found. Patients will appear here once they book an appointment with you.
                  </td>
                </tr>
              )}
              {patients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="hover-row">
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <Link href={`/dashboard/doctor/patients/${patient.id}`} style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem" }}>{patient.name}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Age: {patient.age}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontSize: "0.875rem" }}>{patient.email}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{patient.phone}</div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    {patient.lastVisit}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: patient.nextAppt !== "None" ? "var(--accent-aqua)" : "var(--text-muted)" }}>
                      {patient.nextAppt}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <Link href={`/dashboard/doctor/patients/${patient.id}`} className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                      View Record
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style>{`
            .hover-row:hover { background: rgba(255,255,255,0.02); }
          `}</style>
        </div>
      </div>
    </div>
  );
}
