export function DoctorStatCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
      {/* Total Patients */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Total Patients</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>3,850</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--accent-aqua)" }}>+2.1%</p>
      </div>

      {/* Today's Appointments */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Today&apos;s Appointments</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>14</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Scheduled</p>
      </div>

      {/* New Patients */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>New Patients</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>32</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>this week</p>
      </div>

      {/* Revenue */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Revenue</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>$18,740</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--accent-aqua)" }}>+5.3%</p>
      </div>
    </div>
  );
}
