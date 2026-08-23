import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppointmentsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const supabase = await createClient();
  let appointments: any[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("appointments")
      .select(`
        id,
        start_time,
        status,
        reason,
        mode,
        profiles!appointments_doctor_id_fkey (
          full_name
        )
      `)
      .eq("patient_id", profile.id)
      .order("start_time", { ascending: true });

    if (data) {
      appointments = data;
    }
  }

  const now = new Date();
  const upcomingAppointments = appointments.filter(appt => new Date(appt.start_time) >= now);
  const pastAppointments = appointments.filter(appt => new Date(appt.start_time) < now);

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
        {upcomingAppointments.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No upcoming appointments.</p>
        ) : (
          upcomingAppointments.map((appt) => {
            const startDate = new Date(appt.start_time);
            return (
              <div key={appt.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: 600,
                    color: appt.status === "confirmed" ? "var(--accent-aqua)" : "var(--accent-violet)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "99px",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}>
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                  {appt.mode === "telehealth" && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "99px" }}>Telehealth</span>}
                </div>
                
                <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>{appt.reason || "Visit"}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>{appt.profiles?.full_name || "Doctor"}</p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
                  <span>🕒</span> {startDate.toLocaleDateString()} @ {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  {appt.mode === "telehealth" ? (
                    <button className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
                      🎥 Video Call
                    </button>
                  ) : (
                    <button className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
                      Details
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
