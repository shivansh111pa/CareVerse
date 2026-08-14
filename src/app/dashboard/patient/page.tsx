import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { UpcomingAppointmentCard } from "@/components/dashboard/patient/UpcomingAppointmentCard";
import { LatestPrescriptionCard } from "@/components/dashboard/patient/LatestPrescriptionCard";
import { PatientQuickActions } from "@/components/dashboard/patient/PatientQuickActions";

export default async function PatientDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  if (profile.role === "doctor") redirect("/dashboard/doctor");

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header" id="overview">
        <p className="font-mono text-muted dashboard-page__eyebrow">Patient dashboard</p>
        <h1 className="font-display dashboard-page__title">
          Hello, {profile.full_name || "there"}
        </h1>
        <p className="text-muted dashboard-page__lead">
          Manage your care in one place — appointments, prescriptions, and more.
        </p>
      </header>

      <div className="dashboard-patient-grid">
        <UpcomingAppointmentCard patientId={profile.id} />
        <LatestPrescriptionCard patientId={profile.id} />
      </div>

      <PatientQuickActions />
    </div>
  );
}
