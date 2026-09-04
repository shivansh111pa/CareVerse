import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  BellIcon,
  MessageSquareIcon,
  ClockIcon,
  VideoIcon,
  FileTextIcon,
} from "@/components/ui/Icons";

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
          <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem", borderRadius: "50%" }} aria-label="Notifications">
            <BellIcon style={{ width: 20, height: 20 }} />
          </button>
          <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem", borderRadius: "50%" }} aria-label="Messages">
            <MessageSquareIcon style={{ width: 20, height: 20 }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--surface-subtle)", padding: "0.25rem 0.75rem 0.25rem 0.25rem", borderRadius: "99px", border: "1.5px solid var(--border-dark)" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent-forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "0.75rem", fontWeight: 700 }}>
              {firstName.charAt(0)}
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{firstName}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Welcome Card */}
          <div className="glass-panel" style={{ padding: "1.5rem", background: "var(--surface-cream)", position: "relative", overflow: "hidden" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>
              Good Morning, {firstName}!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5, maxWidth: "80%" }}>
              &quot;Wellness is the complete integration of body, mind, and spirit.&quot; <br/>
              Have a healthy and productive day.
            </p>
          </div>

          {/* Sub-grid for Next Appt and Prescriptions */}
          <div className="dashboard-grid">
            
            {/* Next Appointment */}
            <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--accent-forest)" }}>
                  Next Appointment
                </h3>
              </div>
              <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>
                Telehealth Consult
              </h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Dr. Shivansh A. Pandey
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "var(--text-secondary)", fontSize: "0.8125rem", marginBottom: "1.5rem" }}>
                <ClockIcon style={{ width: 14, height: 14, color: "var(--accent-forest)" }} /> Today @ 2:00 PM
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <button disabled className="btn btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <VideoIcon style={{ width: 14, height: 14 }} /> Video Room
                </button>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Queue</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Token #04</div>
                </div>
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--accent-forest)" }}>
                  Recent Prescriptions
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--accent-forest)", fontWeight: 700, cursor: "pointer" }}>View All</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Amoxicillin 500mg</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>1 capsule 3x daily • 7 days</div>
                  </div>
                  <FileTextIcon style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Telmisartan 40mg</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>1 tablet morning • 30 days</div>
                  </div>
                  <FileTextIcon style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Metformin 500mg</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>1 tablet after meals • 30 days</div>
                  </div>
                  <FileTextIcon style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Health Vitals */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
              Health Vitals
            </h3>
            <select disabled style={{ background: "var(--surface-subtle)", border: "1.5px solid var(--border-dark)", color: "var(--text-primary)", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>
              <option>Last 7 days</option>
            </select>
          </div>

          <div style={{ flex: 1, position: "relative", minHeight: "180px", borderBottom: "1.5px solid var(--border-subtle)", borderLeft: "1.5px solid var(--border-subtle)", padding: "1rem 0 0 1rem", marginBottom: "2rem" }}>
            <div style={{ position: "absolute", left: "-25px", top: "0", bottom: "0", display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "0.625rem", color: "var(--text-muted)" }}>
              <span>150</span>
              <span>120</span>
              <span>90</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
            </div>
            
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M0,150 C40,100 60,180 100,120 C140,140 180,60 220,100 C260,160 300,80 340,110 C380,90 400,20 400,20" fill="none" stroke="var(--accent-forest)" strokeWidth="3" />
              <path d="M0,160 C50,140 80,190 120,140 C160,110 200,90 240,120 C280,180 320,140 360,150 C380,120 400,140 400,140" fill="none" stroke="var(--accent-terracotta)" strokeWidth="2" />
            </svg>

            <div style={{ position: "absolute", left: "0", right: "0", bottom: "-20px", display: "flex", justifyContent: "space-between", fontSize: "0.625rem", color: "var(--text-muted)" }}>
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
          </div>

          <div className="responsive-flex-col" style={{ borderTop: "1.5px solid var(--border-subtle)", paddingTop: "1rem", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>Heart Rate</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>82 <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>bpm</span></div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>Blood Pressure</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>118/76 <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>mmHg</span></div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>Steps Today</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>7,850</div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Visits Bottom Row */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", fontFamily: "var(--font-display)" }}>
          Past Clinic Visits
        </h3>
        
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "600px" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", borderBottom: "1.5px solid var(--border-dark)", textAlign: "left", fontSize: "0.75rem" }}>
              <th style={{ padding: "0.75rem 0", fontWeight: 700 }}>Visit Date</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 700 }}>Reason</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 700 }}>Doctor</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 700 }}>Summary</th>
              <th style={{ padding: "0.75rem 0", fontWeight: 700, textAlign: "right" }}>Records</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td style={{ padding: "0.85rem 0", fontWeight: 600 }}>Oct 14</td>
              <td>Check-up</td>
              <td>Dr. Shivansh</td>
              <td style={{ color: "var(--text-muted)" }}>Routine physical check-up</td>
              <td style={{ textAlign: "right" }}>
                <span style={{ color: "var(--accent-forest)", fontWeight: 600, fontSize: "0.8125rem" }}>
                  PDF Available
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td style={{ padding: "0.85rem 0", fontWeight: 600 }}>Oct 02</td>
              <td>Cold / Viral</td>
              <td>Dr. Shivansh</td>
              <td style={{ color: "var(--text-muted)" }}>Prescription provided for flu</td>
              <td style={{ textAlign: "right" }}>
                <span style={{ color: "var(--accent-forest)", fontWeight: 600, fontSize: "0.8125rem" }}>
                  PDF Available
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.85rem 0", fontWeight: 600 }}>Sep 20</td>
              <td>Annual Screening</td>
              <td>Dr. Shivansh</td>
              <td style={{ color: "var(--text-muted)" }}>Comprehensive health screening</td>
              <td style={{ textAlign: "right" }}>
                <span style={{ color: "var(--accent-forest)", fontWeight: 600, fontSize: "0.8125rem" }}>
                  PDF Available
                </span>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
