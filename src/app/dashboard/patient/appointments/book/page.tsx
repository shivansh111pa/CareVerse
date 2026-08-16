import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BookAppointmentPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const timeSlots = [
    { time: "09:00 AM", status: "unavailable" },
    { time: "09:30 AM", status: "unavailable" },
    { time: "10:00 AM", status: "available" },
    { time: "10:30 AM", status: "selected" },
    { time: "11:00 AM", status: "available" },
    { time: "11:30 AM", status: "available" },
    { time: "01:00 PM", status: "available" },
    { time: "01:30 PM", status: "unavailable" },
    { time: "02:00 PM", status: "available" },
    { time: "02:30 PM", status: "available" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/dashboard/patient/appointments" className="btn btn-ghost" style={{ padding: "0.5rem", borderRadius: "50%" }}>
          <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Book Appointment
          </h1>
          <p className="text-muted">
            Select a date and time for your visit.
          </p>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Toggle & Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Visit Type</label>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "99px", padding: "0.25rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <button disabled style={{ flex: 1, padding: "0.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", fontSize: "0.875rem" }}>
                In-Person
              </button>
              <button disabled style={{ flex: 1, padding: "0.5rem", borderRadius: "99px", background: "transparent", color: "var(--text-bright)", border: "none", fontSize: "0.875rem" }}>
                Telehealth
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Date</label>
            <input type="date" className="glass-input" disabled defaultValue="2024-10-28" />
          </div>
        </div>

        {/* Time Slots */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Available Times</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.75rem" }}>
            {timeSlots.map((slot, index) => {
              let bg = "rgba(255,255,255,0.05)";
              let color = "var(--text-bright)";
              let border = "1px solid rgba(255,255,255,0.1)";
              let opacity = 1;

              if (slot.status === "unavailable") {
                opacity = 0.5;
                color = "var(--text-muted)";
              } else if (slot.status === "selected") {
                bg = "rgba(255, 255, 255, 0.15)";
                border = "1px solid var(--accent-aqua)";
                color = "var(--accent-aqua)";
              }

              return (
                <button
                  key={index}
                  disabled
                  style={{
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: bg,
                    color: color,
                    border: border,
                    opacity: opacity,
                    fontSize: "0.875rem",
                    fontWeight: slot.status === "selected" ? 600 : 400,
                    cursor: slot.status === "unavailable" ? "not-allowed" : "pointer",
                    textAlign: "center"
                  }}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Reason for Visit</label>
          <textarea 
            className="glass-input" 
            placeholder="Please briefly describe your symptoms or reason for visit..."
            rows={4}
            style={{ resize: "none", borderRadius: "12px" }}
            disabled
          ></textarea>
        </div>

        {/* Confirm */}
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <button disabled className="btn" style={{ padding: "0.75rem 2rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", fontSize: "1rem" }}>
            Confirm Appointment
          </button>
        </div>

      </div>
    </div>
  );
}
