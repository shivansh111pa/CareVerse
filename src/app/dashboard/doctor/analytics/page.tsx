import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Clinic Analytics
        </h1>
        <p className="text-muted dashboard-page__lead">
          View revenue, patient retention, and clinical outcomes.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Analytics Module Coming Soon</h2>
        <p className="text-muted" style={{ maxWidth: "400px" }}>Detailed charts and reporting will be available here to help you optimize your practice.</p>
      </div>
    </div>
  );
}
