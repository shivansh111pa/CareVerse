import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PatientDirectoryList } from "@/components/dashboard/doctor/PatientDirectoryList";

export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const supabase = await createClient();
  let patients: any[] = [];

  if (supabase) {
    const { data: appointments } = await supabase
      .from("appointments")
      .select(`
        patient_id,
        start_time,
        profiles!appointments_patient_id_fkey (
          id,
          full_name,
          phone
        )
      `)
      .eq("doctor_id", profile.id)
      .order("start_time", { ascending: false });

    if (appointments) {
      // Deduplicate by patient_id
      const patientMap = new Map();
      appointments.forEach((appt: any) => {
        if (!appt.profiles) return;
        
        if (!patientMap.has(appt.patient_id)) {
          patientMap.set(appt.patient_id, {
            id: appt.profiles.id,
            name: appt.profiles.full_name || "Unknown Patient",
            age: "-", // Age not implemented in profile schema yet
            email: appt.profiles.email || "No email",
            phone: appt.profiles.phone || "No phone",
            lastVisit: new Date(appt.start_time) < new Date() ? new Date(appt.start_time).toLocaleDateString() : "None",
            nextAppt: new Date(appt.start_time) >= new Date() ? new Date(appt.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "None",
            _latestAppt: new Date(appt.start_time)
          });
        } else {
          // Update lastVisit / nextAppt logic if needed
          const p = patientMap.get(appt.patient_id);
          const apptDate = new Date(appt.start_time);
          const now = new Date();
          
          if (apptDate < now && (p.lastVisit === "None" || apptDate > new Date(p.lastVisit))) {
            p.lastVisit = apptDate.toLocaleDateString();
          }
          if (apptDate >= now && (p.nextAppt === "None" || apptDate < new Date(p._latestAppt))) {
            p.nextAppt = apptDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            p._latestAppt = apptDate;
          }
        }
      });
      patients = Array.from(patientMap.values());
    }
  }

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <PatientDirectoryList patients={patients} />
    </div>
  );
}
