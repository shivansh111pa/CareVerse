import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ProfileSettingsForm } from "@/components/dashboard/ProfileSettingsForm";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          My Profile &amp; Settings
        </h1>
        <p className="text-muted">
          Manage your personal details, address, and profile settings.
        </p>
      </header>

      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
