import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function PatientDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  if (profile.role === "doctor") redirect("/dashboard/doctor");

  const firstName = profile.full_name?.split(" ")[0] || "there";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="responsive-header">
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
            Welcome, {profile.full_name}
          </p>
          <h1 className="font-display" style={{ fontSize: "2rem", margin: 0 }}>
            Patient Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ fontSize: "1.25rem", cursor: "pointer", color: "var(--text-muted)" }}>🔔</span>
          <span style={{ fontSize: "1.25rem", cursor: "pointer", color: "var(--text-muted)" }}>💬</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem 0.25rem 0.25rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-aqua)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: "0.75rem", fontWeight: 700 }}>
              {firstName.charAt(0)}
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{firstName}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Welcome Card */}
          <div className="glass-panel" style={{ padding: "1.5rem", background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)", position: "relative", overflow: "hidden" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>Good Morning, {firstName}!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.5, maxWidth: "80%" }}>
              &quot;Wellness is the complete integration of body, mind, and spirit.&quot; <br/>
              Have a healthy and productive day.
            </p>
          </div>

          {/* Sub-grid for Next Appt and Prescriptions */}
          <div className="dashboard-grid">
            
            {/* Next Appointment */}
            <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Next Appointment</h3>
              </div>
              <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Telehealth Consult</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>Dr. Emily Vance</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
                <span>🕒</span> Today @ 2:00 PM PST
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <button disabled className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
                  🎥 Video Call
                </button>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-muted)" }}>Countdown</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>00 min 80s</div>
                </div>
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Recent Prescriptions</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--accent-aqua)", cursor: "pointer" }}>View All</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 500 }}>Amoxicillin</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Details, dosage, instructions</div>
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>›</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 500 }}>Lisinopril</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Dosage, 7 mg, instructions</div>
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>›</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 500 }}>Metformin</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Details, instructions</div>
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>›</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Health Vitals */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 500 }}>Health Vitals</h3>
            <select disabled style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>
              <option>Last 7 days</option>
            </select>
          </div>

          <div style={{ flex: 1, position: "relative", minHeight: "200px", borderBottom: "1px solid rgba(255,255,255,0.1)", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "1rem 0 0 1rem", marginBottom: "2rem" }}>
            <div style={{ position: "absolute", left: "-25px", top: "0", bottom: "0", display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "0.625rem", color: "var(--text-muted)" }}>
              <span>150</span>
              <span>120</span>
              <span>90</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
            </div>
            
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M0,150 C40,100 60,180 100,120 C140,140 180,60 220,100 C260,160 300,80 340,110 C380,90 400,20 400,20" fill="none" stroke="var(--accent-aqua)" strokeWidth="3" />
              <path d="M0,160 C50,140 80,190 120,140 C160,110 200,90 240,120 C280,180 320,140 360,150 C380,120 400,140 400,140" fill="none" stroke="var(--accent-violet)" strokeWidth="2" />
            </svg>

            <div style={{ position: "absolute", left: "0", right: "0", bottom: "-20px", display: "flex", justifyContent: "space-between", fontSize: "0.625rem", color: "var(--text-muted)" }}>
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
          </div>

          <div className="responsive-flex-col" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Heart Rate</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>82 <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>bpm</span></div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Blood Pressure</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>118/76 <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>mmHg</span></div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Steps</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>7,850</div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Visits Bottom Row */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "1rem" }}>Past Visits</h3>
        
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "600px" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: "0.75rem 0", fontWeight: 400 }}>Visit Date</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 400 }}>Reason</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 400 }}>Doctor</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 400 }}>Summary</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 400, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "1rem 0" }}>Oct 14</td>
              <td>Check-up</td>
              <td>Dr. Vance</td>
              <td style={{ color: "var(--text-muted)" }}>Routine physical check-up</td>
              <td style={{ textAlign: "right", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <span style={{ color: "var(--accent-aqua)", cursor: "not-allowed" }}>↓ Download</span>
                <span style={{ color: "var(--accent-aqua)", cursor: "not-allowed" }}>Details</span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "1rem 0" }}>Oct 2</td>
              <td>Cold/Flu</td>
              <td>Dr. Miller</td>
              <td style={{ color: "var(--text-muted)" }}>Prescription provided for flu</td>
              <td style={{ textAlign: "right", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <span style={{ color: "var(--accent-aqua)", cursor: "not-allowed" }}>↓ Download</span>
                <span style={{ color: "var(--accent-aqua)", cursor: "not-allowed" }}>Details</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "1rem 0" }}>Sep 20</td>
              <td>Physical</td>
              <td>Dr. Vance</td>
              <td style={{ color: "var(--text-muted)" }}>Annual sports physical</td>
              <td style={{ textAlign: "right", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <span style={{ color: "var(--accent-aqua)", cursor: "not-allowed" }}>↓ Download</span>
                <span style={{ color: "var(--accent-aqua)", cursor: "not-allowed" }}>Details</span>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
