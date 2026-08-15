import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { DoctorStatCards } from "@/components/dashboard/doctor/DoctorStatCards";
import { TodayAppointmentsList } from "@/components/dashboard/doctor/TodayAppointmentsList";
import { PatientVisitsChart } from "@/components/dashboard/doctor/PatientVisitsChart";

export default async function DoctorDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  if (profile.role !== "doctor") redirect("/dashboard/patient");

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Top Header */}
      <div className="responsive-flex-col" style={{ gap: "1rem" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
          <input 
            type="text" 
            placeholder="Search patients, records..." 
            className="glass-input" 
            style={{ paddingLeft: "2.5rem", borderRadius: "99px" }} 
            disabled 
          />
          <svg style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn btn-ghost" style={{ padding: "0.5rem", borderRadius: "50%" }}>
            <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "var(--accent-aqua)", color: "var(--bg-deep)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {profile.full_name?.[0] || "D"}
            </div>
            <span style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{profile.full_name || "Doctor"}</span>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Welcome back, {profile.full_name || "Doctor"}!
        </h1>
        <p className="text-muted dashboard-page__lead">
          {todayDate}
        </p>
      </header>

      {/* Stats Cards */}
      <DoctorStatCards />

      {/* Chart & List Grid */}
      <div className="dashboard-grid">
        <PatientVisitsChart />
        <TodayAppointmentsList doctorId={profile.id} />
      </div>
    </div>
  );
}
