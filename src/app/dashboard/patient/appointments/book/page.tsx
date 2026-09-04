import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookAppointmentForm } from "@/components/dashboard/patient/BookAppointmentForm";
export default async function BookAppointmentPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const timeSlots = [
    { time: "09:00 AM", status: "unavailable" },
    { time: "09:30 AM", status: "unavailable" },
    { time: "10:00 AM", status: "available" },
    { time: "10:30 AM", status: "selected" },
    { time: "11:00 AM", status: "available" },
    { time: "11:30 AM", status: "available" },
    { time: "01:00 PM", status: "available" },
    { time: "01:30 PM", status: "unavailable" },
    { time: "02:00 PM", status: "available" },
    { time: "02:30 PM", status: "available" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/dashboard/patient/appointments" className="btn btn-ghost" style={{ padding: "0.5rem", borderRadius: "50%" }}>
          <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Book Appointment
          </h1>
          <p className="text-muted">
            Select a date and time for your visit.
          </p>
        </div>
      </header>

      <BookAppointmentForm patientId={profile.id} />
    </div>
  );
}
