import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function PatientsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Patient Directory
        </h1>
        <p className="text-muted dashboard-page__lead">
          Manage your patients and view their medical history.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Patient List Module Coming Soon</h2>
        <p className="text-muted" style={{ maxWidth: "400px" }}>This module is currently under development. Soon you will be able to search, filter, and view detailed records for all your patients.</p>
      </div>
    </div>
  );
}
