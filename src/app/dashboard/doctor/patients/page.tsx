import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PatientsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const mockPatients = [
    { id: "P1", name: "Liam Nguyen", age: 34, lastVisit: "Oct 14, 2024", nextAppt: "Oct 26, 2024 (09:00 AM)", email: "liam.n@example.com", phone: "(555) 123-4567" },
    { id: "P2", name: "Isabella Rossi", age: 28, lastVisit: "Oct 2, 2024", nextAppt: "Oct 26, 2024 (10:15 AM)", email: "i.rossi@example.com", phone: "(555) 987-6543" },
    { id: "P3", name: "David Kim", age: 45, lastVisit: "Sep 15, 2024", nextAppt: "Oct 26, 2024 (11:30 AM)", email: "dkim80@example.com", phone: "(555) 456-7890" },
    { id: "P4", name: "Sofia Garcia", age: 31, lastVisit: "Aug 20, 2024", nextAppt: "Oct 26, 2024 (01:45 PM)", email: "s.garcia@example.com", phone: "(555) 222-3333" },
    { id: "P5", name: "Marcus Johnson", age: 52, lastVisit: "Oct 25, 2024", nextAppt: "None", email: "mjohnson@example.com", phone: "(555) 777-8888" },
    { id: "P6", name: "Emma Wilson", age: 24, lastVisit: "Jul 10, 2024", nextAppt: "Nov 5, 2024 (02:00 PM)", email: "emma.w@example.com", phone: "(555) 444-5555" },
  ];

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
              {mockPatients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="hover-row">
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <Link href={`/dashboard/doctor/patients/${patient.id}`} style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
                        {patient.name.charAt(0)}
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
