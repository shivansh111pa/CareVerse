import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  FileTextIcon,
} from "@/components/ui/Icons";
import { NextAppointmentCard } from "@/components/dashboard/patient/NextAppointmentCard";
import { createClient } from "@/lib/supabase/server";
import { PATIENT_QUICK_ACTIONS } from "@/lib/dashboard/nav";

export const dynamic = 'force-dynamic';

export default async function PatientDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  if (profile.role === "doctor") redirect("/dashboard/doctor");

  const firstName = profile.full_name?.split(" ")[0] || "there";

  const supabase = await createClient();
  let recentPrescriptions: any[] = [];
  let pastVisits: any[] = [];

  if (supabase) {
    // Fetch recent prescriptions
    const { data: rxData } = await supabase
      .from('prescriptions')
      .select('id, medicines, created_at, profiles!prescriptions_doctor_id_fkey(full_name)')
      .eq('patient_id', profile.id)
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
              Welcome back, {firstName}!
            </h1>
            <p className="text-muted dashboard-page__lead">
              Here is your daily health summary and upcoming schedule.
            </p>
          </div>
          
          <Link href="/dashboard/patient/appointments/book" className="btn btn-primary" style={{ textDecoration: "none" }}>
            + Book Appointment
          </Link>
        </header>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--surface-subtle)", padding: "0.25rem 0.75rem 0.25rem 0.25rem", borderRadius: "99px", border: "1.5px solid var(--border-dark)" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent-forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "0.75rem", fontWeight: 700 }}>
              {firstName.charAt(0)}
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{firstName}</span>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="glass-panel" style={{ padding: "1.5rem", background: "var(--surface-cream)", position: "relative", overflow: "hidden" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>
          Good Day, {firstName}!
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5, maxWidth: "85%" }}>
          &quot;Wellness is the complete integration of body, mind, and spirit.&quot; <br/>
          Have a healthy and productive day.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {PATIENT_QUICK_ACTIONS.map((action, i) => (
          <Link key={i} href={action.href} className="glass-panel hover-lift" style={{ padding: "1.25rem", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: "0.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--accent-aqua)" }}>{action.label}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{action.description}</div>
          </Link>
        ))}
      </div>

      {/* Sub-grid for Next Appt and Prescriptions */}
      <div className="dashboard-grid">
        {/* Next Appointment */}
        <NextAppointmentCard patientId={profile.id} />

        {/* Recent Prescriptions */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--accent-forest)" }}>
              Recent Prescriptions
            </h3>
            <Link href="/dashboard/patient/prescriptions" style={{ fontSize: "0.75rem", color: "var(--accent-forest)", fontWeight: 700 }}>View All</Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {recentPrescriptions.length === 0 ? (
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No recent prescriptions on file.</div>
            ) : (
              recentPrescriptions.map((rx) => (
                <div key={rx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{rx.medicines?.[0]?.name || rx.prescription?.split('\n')[0] || "Prescription"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Dr. {rx.profiles?.full_name} • {new Date(rx.created_at).toLocaleDateString()}</div>
                  </div>
                  <FileTextIcon style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                </div>
              ))
            )}
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
              {pastVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "1rem 0", textAlign: "center", color: "var(--text-muted)" }}>
                    No past visits found.
                  </td>
                </tr>
              ) : (
                pastVisits.map((visit) => (
                  <tr key={visit.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "0.85rem 0", fontWeight: 600 }}>{new Date(visit.created_at).toLocaleDateString()}</td>
                    <td>{visit.appointments?.reason || "General Checkup"}</td>
                    <td>Dr. {visit.profiles?.full_name || "Shivansh A. Pandey"}</td>
                    <td style={{ color: "var(--text-muted)" }}>{visit.diagnosis || "Consultation complete"}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link href="/dashboard/patient/records" className="btn btn-secondary" style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", textDecoration: "none" }}>
                        View Details
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
