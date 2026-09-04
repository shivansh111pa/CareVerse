import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { SettingsIcon } from "@/components/ui/Icons";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          My Profile
        </h1>
        <p className="text-muted">
          Manage your personal details, address, and avatar picture.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "360px" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--surface-subtle)", border: "2px solid var(--border-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)", marginBottom: "1rem" }}>
          <SettingsIcon style={{ width: 32, height: 32 }} />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Settings Module Coming Soon</h2>
        <p className="text-muted" style={{ maxWidth: "400px", fontSize: "0.9375rem" }}>Update your contact information, password, and notification preferences.</p>
      </div>
    </div>
  );
}
