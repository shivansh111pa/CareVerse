import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AppointmentsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const mockAppointments = [
    { id: "A1", time: "09:00 AM", date: "Oct 26, 2024", patient: "Liam Nguyen", type: "Follow-up", status: "Checked-In" },
    { id: "A2", time: "10:15 AM", date: "Oct 26, 2024", patient: "Isabella Rossi", type: "Physical", status: "Confirmed" },
    { id: "A3", time: "11:30 AM", date: "Oct 26, 2024", patient: "David Kim", type: "Consultation", status: "Scheduled" },
    { id: "A4", time: "01:45 PM", date: "Oct 26, 2024", patient: "Sofia Garcia", type: "Vaccination", status: "Cancelled" },
    { id: "A5", time: "03:00 PM", date: "Oct 25, 2024", patient: "Marcus Johnson", type: "Check-up", status: "Completed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Completed":
        return "var(--accent-aqua)";
      case "Scheduled":
        return "var(--accent-violet)";
      case "Cancelled":
        return "rgba(255, 99, 132, 1)"; // A red/pink
      case "Checked-In":
        return "var(--accent-aqua)"; // Maybe a brighter green, reusing aqua for now
      default:
        return "var(--text-muted)";
    }
  };

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Appointments
          </h1>
          <p className="text-muted dashboard-page__lead">
            Manage your daily schedule and all patient visits.
          </p>
        </div>
        
        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ position: "relative", width: "100%", minWidth: "250px" }}>
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="glass-input" 
              style={{ paddingLeft: "2.5rem", borderRadius: "99px" }} 
              disabled 
            />
            <svg style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select disabled className="glass-input" style={{ borderRadius: "99px", width: "auto" }}>
            <option>All Statuses</option>
            <option>Scheduled</option>
            <option>Confirmed</option>
            <option>Checked-In</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <input type="date" className="glass-input" style={{ borderRadius: "99px", width: "auto" }} disabled />
        </div>
      </header>

      {/* Appointments List */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Time</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Patient</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Type</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Status</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAppointments.map((appt) => (
                <tr key={appt.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem 0" }}>
                    <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{appt.time}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{appt.date}</div>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{appt.patient}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{appt.type}</td>
                  <td>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: 600,
                      color: getStatusColor(appt.status),
                      background: "rgba(255,255,255,0.05)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "99px",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button disabled className="btn btn-ghost" style={{ padding: "0.375rem 1rem", fontSize: "0.8125rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
                        Details
                      </button>
                      <button disabled className="btn" style={{ padding: "0.375rem 1rem", fontSize: "0.8125rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", opacity: appt.status === "Cancelled" || appt.status === "Completed" ? 0.5 : 1 }}>
                        Check-In
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
