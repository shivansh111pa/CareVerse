import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClockIcon, VideoIcon, CalendarIcon } from "@/components/ui/Icons";

export default async function AppointmentsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const appointments = [
    {
      id: "1",
      type: "Telehealth Consultation",
      doctor: "Dr. Shivansh A. Pandey",
      date: "Today",
      time: "2:00 PM",
      status: "Confirmed",
      isVideo: true,
    },
    {
      id: "2",
      type: "In-Clinic Follow-up",
      doctor: "Dr. Shivansh A. Pandey",
      date: "Nov 04, 2024",
      time: "10:30 AM",
      status: "Scheduled",
      isVideo: false,
    },
    {
      id: "3",
      type: "Routine Check-up",
      doctor: "Dr. Shivansh A. Pandey",
      date: "Nov 18, 2024",
      time: "03:15 PM",
      status: "Scheduled",
      isVideo: false,
    }
  ];

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
        <Link href="/dashboard/patient/appointments/book" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
          <CalendarIcon style={{ width: 16, height: 16 }} />
          Book New Appointment
        </Link>
      </header>

      {/* Grid of Appointments */}
      <div className="dashboard-grid">
        {appointments.map((appt) => (
          <div key={appt.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span className={`clinic-stamp ${appt.status === "Confirmed" ? "clinic-stamp--verified" : ""}`} style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}>
                {appt.status}
              </span>
              {appt.isVideo && (
                <span className="clinic-stamp" style={{ fontSize: "0.6875rem", padding: "0.2rem 0.55rem" }}>
                  Telehealth
                </span>
              )}
            </div>
            
            <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>{appt.type}</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>{appt.doctor}</p>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "var(--text-secondary)", fontSize: "0.8125rem", marginBottom: "1.5rem" }}>
              <ClockIcon style={{ width: 14, height: 14, color: "var(--accent-forest)" }} /> {appt.date} @ {appt.time}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              {appt.isVideo ? (
                <button disabled className="btn btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <VideoIcon style={{ width: 14, height: 14 }} /> Video Room
                </button>
              ) : (
                <button disabled className="btn btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}>
                  Details
                </button>
              )}
              {appt.date === "Today" && appt.isVideo && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Queue</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Ready</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
