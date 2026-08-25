import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { NextAppointmentCard } from "@/components/dashboard/patient/NextAppointmentCard";
import { createClient } from "@/lib/supabase/server";
import { LogVitalsWrapper } from "@/components/dashboard/patient/LogVitalsWrapper";

export const dynamic = 'force-dynamic';

export default async function PatientDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  if (profile.role === "doctor") redirect("/dashboard/doctor");

  const firstName = profile.full_name?.split(" ")[0] || "there";

  const supabase = await createClient();
  let latestVitals = { heart_rate: 0, blood_pressure_systolic: 0, blood_pressure_diastolic: 0, steps: 0 };
  let recentPrescriptions: any[] = [];
  let pastVisits: any[] = [];

  if (supabase) {
    // Fetch latest vitals
    const { data: vitalsData } = await supabase
      .from('vitals')
      .select('*')
      .eq('patient_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (vitalsData) latestVitals = vitalsData;

    // Fetch recent prescriptions (where prescription is not null)
    const { data: rxData } = await supabase
      .from('medical_records')
      .select('id, prescription, created_at, profiles!medical_records_doctor_id_fkey(full_name)')
      .eq('patient_id', profile.id)
      .not('prescription', 'is', null)
      .neq('prescription', '')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (rxData) recentPrescriptions = rxData;

    // Fetch past visits
    const { data: visitsData } = await supabase
      .from('medical_records')
      .select('id, diagnosis, created_at, appointments(reason), profiles!medical_records_doctor_id_fkey(full_name)')
      .eq('patient_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (visitsData) pastVisits = visitsData;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="responsive-header">
        <header id="overview" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Welcome back, {profile.full_name?.split(" ")[0]}!
          </h1>
          <p className="text-muted dashboard-page__lead">
            Here is your daily health summary and upcoming schedule.
          </p>
        </div>
        
        <Link href="/dashboard/patient/appointments/book" className="btn" style={{ padding: "0.75rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", textDecoration: "none" }}>
          + Book Appointment
        </Link>
      </header>
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
            <NextAppointmentCard patientId={profile.id} />

            {/* Recent Prescriptions */}
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Recent Prescriptions</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--accent-aqua)", cursor: "pointer" }}>View All</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {recentPrescriptions.length === 0 ? (
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No recent prescriptions</div>
                ) : (
                  recentPrescriptions.map((rx) => (
                    <div key={rx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                      <div>
                        <div style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{rx.prescription?.split('\n')[0] || "Prescription"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Dr. {rx.profiles?.full_name} • {new Date(rx.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Health Vitals */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 500 }}>Health Vitals</h3>
            <LogVitalsWrapper patientId={profile.id} />
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
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{latestVitals.heart_rate || 0} <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>bpm</span></div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Blood Pressure</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{latestVitals.blood_pressure_systolic || 0}/{latestVitals.blood_pressure_diastolic || 0} <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>mmHg</span></div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Steps</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{latestVitals.steps || 0}</div>
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
            {pastVisits.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "1rem 0", textAlign: "center", color: "var(--text-muted)" }}>
                  No past visits found.
                </td>
              </tr>
            ) : (
              pastVisits.map((visit) => (
                <tr key={visit.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.75rem 0" }}>{new Date(visit.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "0.75rem 0" }}>{visit.appointments?.reason || "General"}</td>
                  <td style={{ padding: "0.75rem 0" }}>Dr. {visit.profiles?.full_name}</td>
                  <td style={{ padding: "0.75rem 0" }}>{visit.diagnosis}</td>
                  <td style={{ padding: "0.75rem 0", textAlign: "right" }}>
                    <Link href={`/dashboard/patient/records`} className="btn btn-ghost" style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
