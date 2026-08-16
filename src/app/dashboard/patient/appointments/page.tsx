import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppointmentsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const upcomingAppointments = [
    { id: "U1", doctor: "Dr. Emily Vance", type: "Telehealth Consult", date: "Today", time: "2:00 PM PST", status: "Scheduled", isVideo: true },
    { id: "U2", doctor: "Dr. Miller", type: "Follow-up", date: "Nov 5, 2024", time: "10:00 AM PST", status: "Confirmed", isVideo: false }
  ];

  const pastAppointments = [
    { id: "P1", date: "Oct 14, 2024", reason: "Check-up", doctor: "Dr. Emily Vance", summary: "Routine physical check-up" },
    { id: "P2", date: "Oct 2, 2024", reason: "Cold/Flu", doctor: "Dr. Miller", summary: "Prescription provided for flu" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            My Appointments
          </h1>
          <p className="text-muted">
            Manage your upcoming and past visits.
          </p>
        </div>
        
        <Link href="/dashboard/patient/appointments/book" className="btn" style={{ padding: "0.75rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", textDecoration: "none" }}>
          + Book Appointment
        </Link>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button className="btn btn-ghost" style={{ padding: "0.75rem 0", color: "var(--text-bright)", borderBottom: "2px solid var(--accent-aqua)", borderRadius: 0 }}>
          Upcoming
        </button>
        <button className="btn btn-ghost" style={{ padding: "0.75rem 0", color: "var(--text-muted)", borderRadius: 0 }}>
          Past
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Upcoming Cards */}
        {upcomingAppointments.map((appt) => (
          <div key={appt.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ 
                fontSize: "0.75rem", 
                fontWeight: 600,
                color: appt.status === "Confirmed" ? "var(--accent-aqua)" : "var(--accent-violet)",
                background: "rgba(255,255,255,0.05)",
                padding: "0.25rem 0.75rem",
                borderRadius: "99px",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                {appt.status}
              </span>
              {appt.isVideo && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "99px" }}>Telehealth</span>}
            </div>
            
            <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>{appt.type}</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>{appt.doctor}</p>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
              <span>🕒</span> {appt.date} @ {appt.time}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              {appt.isVideo ? (
                <button disabled className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
                  🎥 Video Call
                </button>
              ) : (
                <button disabled className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
                  Details
                </button>
              )}
              {appt.date === "Today" && appt.isVideo && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-muted)" }}>Countdown</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>Ready</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
