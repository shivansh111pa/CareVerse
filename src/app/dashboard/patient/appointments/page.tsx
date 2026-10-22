import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClockIcon, CalendarIcon } from "@/components/ui/Icons";

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
  const upcomingAppointments = appointments
    .filter(appt => new Date(appt.start_time) >= now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const pastAppointments = appointments
    .filter(appt => new Date(appt.start_time) < now)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header className="responsive-header">
        <div>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            My Appointments
          </h1>
          <p className="text-muted">
            Manage your schedule and clinic visits arranged chronologically by date and time.
          </p>
        </div>
        <Link href="/dashboard/patient/appointments/book" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", textDecoration: "none" }}>
          <CalendarIcon style={{ width: 16, height: 16 }} />
          Book New Appointment
        </Link>
      </header>

      {/* Upcoming Appointments Section */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <h2 className="font-display" style={{ fontSize: "1.25rem", margin: 0 }}>
            Upcoming Appointments
          </h2>
          <span className="clinic-stamp" style={{ fontSize: "0.75rem", padding: "0.15rem 0.6rem" }}>
            {upcomingAppointments.length} Scheduled
          </span>
        </div>

        <div className="dashboard-grid">
          {upcomingAppointments.length === 0 ? (
            <div className="glass-panel" style={{ padding: "2.5rem 1.5rem", gridColumn: "1 / -1", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>No upcoming appointments scheduled.</p>
              <Link href="/dashboard/patient/appointments/book" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-flex", textDecoration: "none" }}>
                Book an Appointment
              </Link>
            </div>
          ) : (
            upcomingAppointments.map((appt) => {
              const startDate = new Date(appt.start_time);
              const isConfirmed = appt.status?.toLowerCase() === "confirmed";

              return (
                <div key={appt.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span className={`clinic-stamp ${isConfirmed ? "clinic-stamp--verified" : ""}`} style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}>
                      {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1) || "Scheduled"}
                    </span>
                    <span className="clinic-stamp" style={{ padding: "0.2rem 0.55rem", fontSize: "0.6875rem" }}>
                      In-Clinic Visit
                    </span>
                  </div>

                  {/* Prominent Chronological Date & Time Header */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: "10px", 
                    padding: "0.75rem 1rem" 
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-bright)" }}>
                      <CalendarIcon style={{ width: 15, height: 15, color: "var(--accent-aqua)", flexShrink: 0 }} />
                      <span>{startDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", color: "var(--accent-forest)", fontWeight: 600 }}>
                      <ClockIcon style={{ width: 14, height: 14, flexShrink: 0 }} />
                      <span>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>
                      {appt.reason || "General Consultation"}
                    </h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
                      Dr. {appt.profiles?.full_name || "Shivansh A. Pandey"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Past Appointments Section */}
      {pastAppointments.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 className="font-display" style={{ fontSize: "1.25rem", margin: 0, color: "var(--text-secondary)" }}>
              Past Consultations
            </h2>
            <span className="clinic-stamp" style={{ fontSize: "0.75rem", padding: "0.15rem 0.6rem" }}>
              {pastAppointments.length} Completed / Past
            </span>
          </div>

          <div className="dashboard-grid">
            {pastAppointments.map((appt) => {
              const startDate = new Date(appt.start_time);
              return (
                <div key={appt.id} className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem", opacity: 0.85 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                    <span className="clinic-stamp" style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}>
                      {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1) || "Past"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      In-Clinic Visit
                    </span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(255,255,255,0.06)", 
                    borderRadius: "8px", 
                    padding: "0.6rem 0.85rem" 
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      <CalendarIcon style={{ width: 14, height: 14, color: "var(--text-muted)", flexShrink: 0 }} />
                      <span>{startDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      <ClockIcon style={{ width: 13, height: 13, flexShrink: 0 }} />
                      <span>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.2rem" }}>
                      {appt.reason || "General Consultation"}
                    </h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", margin: 0 }}>
                      Dr. {appt.profiles?.full_name || "Doctor"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
