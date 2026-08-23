import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { AvailabilityEditor } from "@/components/dashboard/doctor/AvailabilityEditor";
export default async function DoctorAvailabilityPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview">
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Availability Settings
        </h1>
        <p className="text-muted dashboard-page__lead">
          Manage your weekly schedule and custom date overrides.
        </p>
      </header>

      <AvailabilityEditor doctorId={profile.id} />
    </div>
  );
}
