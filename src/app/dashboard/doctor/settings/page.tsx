import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ProfileSettingsForm } from "@/components/dashboard/ProfileSettingsForm";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Doctor Profile &amp; Settings
        </h1>
        <p className="text-muted dashboard-page__lead">
          Manage your personal details, address, and clinic preferences.
        </p>
      </header>

      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
