import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClockIcon, VideoIcon, CalendarIcon } from "@/components/ui/Icons";

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
      <header className="responsive-header">
        <div>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            My Appointments
          </h1>
          <p className="text-muted">
            Manage your upcoming visits and telehealth sessions.
          </p>
        </div>
        <Link href="/dashboard/patient/appointments/book" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", textDecoration: "none" }}>
          <CalendarIcon style={{ width: 16, height: 16 }} />
          Book New Appointment
        </Link>
      </header>

      {/* Grid of Appointments */}
      <div className="dashboard-grid">
        {upcomingAppointments.length === 0 ? (
          <div className="glass-panel" style={{ padding: "2rem", gridColumn: "1 / -1", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>No upcoming appointments scheduled.</p>
            <Link href="/dashboard/patient/appointments/book" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-flex", textDecoration: "none" }}>
              Book an Appointment
            </Link>
          </div>
        ) : (
          upcomingAppointments.map((appt) => {
            const startDate = new Date(appt.start_time);
            const isConfirmed = appt.status?.toLowerCase() === "confirmed";
            const isTelehealth = appt.mode === "telehealth";

            return (
              <div key={appt.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className={`clinic-stamp ${isConfirmed ? "clinic-stamp--verified" : ""}`} style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}>
                    {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1) || "Scheduled"}
                  </span>
                  {isTelehealth && (
                    <span className="clinic-stamp" style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}>
                      Telehealth
                    </span>
                  )}
                </div>
                
                <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>
                  {appt.reason || "General Consultation"}
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                  Dr. {appt.profiles?.full_name || "Shivansh A. Pandey"}
                </p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "var(--text-secondary)", fontSize: "0.8125rem", marginBottom: "1.5rem" }}>
                  <ClockIcon style={{ width: 14, height: 14, color: "var(--accent-forest)" }} /> {startDate.toLocaleDateString()} @ {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  {isTelehealth ? (
                    <button className="btn btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <VideoIcon style={{ width: 14, height: 14 }} /> Video Room
                    </button>
                  ) : (
                    <button className="btn btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}>
                      In-Clinic Visit
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
