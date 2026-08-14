import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { DoctorStatCards } from "@/components/dashboard/doctor/DoctorStatCards";
import { TodayAppointmentsList } from "@/components/dashboard/doctor/TodayAppointmentsList";

export default async function DoctorDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  if (profile.role !== "doctor") redirect("/dashboard/patient");

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header" id="overview">
        <p className="font-mono text-muted dashboard-page__eyebrow">Doctor dashboard</p>
        <h1 className="font-display dashboard-page__title">
          Good day, {profile.full_name || "Doctor"}
        </h1>
        <p className="text-muted dashboard-page__lead">
          Here&apos;s your clinic at a glance. Modules will fill in live data as they ship.
        </p>
      </header>

      <DoctorStatCards />

      <TodayAppointmentsList doctorId={profile.id} />
    </div>
  );
}
