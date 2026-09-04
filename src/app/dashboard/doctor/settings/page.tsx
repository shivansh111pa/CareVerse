import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { SettingsIcon } from "@/components/ui/Icons";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Clinic Settings
        </h1>
        <p className="text-muted dashboard-page__lead">
          Manage your account, billing, and clinic preferences.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--surface-subtle)", border: "2px solid var(--border-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)", marginBottom: "1rem" }}>
          <SettingsIcon style={{ width: 32, height: 32 }} />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Settings Module Coming Soon</h2>
        <p className="text-muted" style={{ maxWidth: "400px", fontSize: "0.9375rem" }}>Update your profile, notification preferences, and subscription details here.</p>
      </div>
    </div>
  );
}
