import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DoctorAppointmentsList } from "@/components/dashboard/doctor/DoctorAppointmentsList";

export default async function AppointmentsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <DoctorAppointmentsList doctorId={profile.id} />
    </div>
  );
}
