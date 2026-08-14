import {
  DashboardEmptyState,
  DashboardModuleCard,
} from "@/components/dashboard/shared/DashboardModuleCard";

interface TodayAppointmentsListProps {
  doctorId?: string;
}

export function TodayAppointmentsList({ doctorId }: TodayAppointmentsListProps) {
  void doctorId;

  const mockAppointments = [
    { time: "09:00 AM", name: "Liam Nguyen", type: "Follow-up", status: "Scheduled" },
    { time: "10:15 AM", name: "Isabella Rossi", type: "Physical", status: "Confirmed" },
    { time: "11:30 AM", name: "David Kim", type: "Consultation", status: "Confirmed" },
    { time: "01:45 PM", name: "Sofia Garcia", type: "Vaccination", status: "Confirmed" },
  ];

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem" }}>Upcoming Appointments (Today)</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        {mockAppointments.map((appt, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px", alignItems: "center", paddingBottom: "1rem", borderBottom: i === mockAppointments.length - 1 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{appt.time}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{appt.name}</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{appt.type}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
              <span style={{ fontSize: "0.75rem", color: appt.status === "Confirmed" ? "var(--accent-aqua)" : "var(--accent-violet)" }}>{appt.status}</span>
              <button disabled className="btn btn-ghost" style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.12)", height: "auto" }}>
                Check-In
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
