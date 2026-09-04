import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { XIcon } from "@/components/ui/Icons";

export default async function DoctorAvailabilityPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Availability Settings
        </h1>
        <p className="text-muted dashboard-page__lead">
          Manage your weekly schedule and custom date overrides.
        </p>
      </header>

      <div className="dashboard-grid">
        {/* Weekly Availability */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Weekly Schedule</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {daysOfWeek.map((day) => (
              <div key={day} style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", gap: "1rem", paddingBottom: "1rem", borderBottom: day === "Sunday" ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontWeight: 500 }}>{day}</div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input type="time" defaultValue="09:00" className="glass-input" style={{ width: "auto" }} disabled />
                  <span>to</span>
                  <input type="time" defaultValue="17:00" className="glass-input" style={{ width: "auto" }} disabled />
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Closed</span>
                    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" className="sr-only" disabled />
                      <div style={{ width: "40px", height: "24px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", position: "relative" }}>
                        <div style={{ position: "absolute", left: "2px", top: "2px", width: "20px", height: "20px", background: "var(--text-muted)", borderRadius: "50%", transition: "all 0.3s" }}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button disabled className="btn" style={{ padding: "0.5rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
              Save Weekly Schedule
            </button>
          </div>
        </div>

        {/* Custom Hours / Overrides */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>Date Overrides</h2>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>Mark specific dates as closed or set custom hours.</p>
          </div>

          {/* Simple Mock Calendar Picker */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Select Date</label>
            <input type="date" className="glass-input" disabled />
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Start Time</label>
              <input type="time" className="glass-input" disabled />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>End Time</label>
              <input type="time" className="glass-input" disabled />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" id="mark-closed" disabled style={{ width: "1rem", height: "1rem" }} />
            <label htmlFor="mark-closed" style={{ fontSize: "0.875rem" }}>Mark as closed all day</label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "1rem" }}>
            <button disabled className="btn btn-ghost" style={{ padding: "0.5rem 1.5rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
              Add Override
            </button>
          </div>
          
          {/* List of existing overrides (placeholder) */}
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "1rem" }}>Upcoming Overrides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>Nov 23, 2024</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent-violet)" }}>Closed All Day (Thanksgiving)</div>
                </div>
                <span style={{ color: "var(--text-muted)", cursor: "not-allowed", display: "inline-flex", alignItems: "center" }}>
                  <XIcon style={{ width: 14, height: 14 }} />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
