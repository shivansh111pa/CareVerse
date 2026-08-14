import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Account Settings
        </h1>
        <p className="text-muted">
          Manage your profile, preferences, and billing.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚙️</span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Settings Module Coming Soon</h2>
        <p className="text-muted" style={{ maxWidth: "400px" }}>Update your contact information, password, and notification preferences.</p>
      </div>
    </div>
  );
}
