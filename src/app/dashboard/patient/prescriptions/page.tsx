import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PrescriptionListClient from "@/components/dashboard/patient/PrescriptionListClient";

export const dynamic = 'force-dynamic';

export default async function PrescriptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const supabase = await createClient();
  let prescriptions: any[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('prescriptions')
      .select(`
        id,
        diagnosis,
        general_notes,
        medicines,
        pdf_url,
        status,
        created_at,
        profiles!prescriptions_doctor_id_fkey (
          full_name
        )
      `)
      .eq('patient_id', profile.id)
      .order('created_at', { ascending: false });

    if (data) {
      prescriptions = (data as any[]).map(record => ({
        id: record.id,
        dateIssued: new Date(record.created_at).toLocaleDateString(),
        doctor: "Dr. " + record.profiles?.full_name,
        status: record.status || "Active",
        primaryMedicine: record.medicines?.[0]?.name || "Prescription",
        medicines: record.medicines,
        diagnosis: record.diagnosis,
        notes: record.general_notes,
        pdfUrl: record.pdf_url
      }));
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Prescriptions
        </h1>
        <p className="text-muted" style={{ fontSize: "1.125rem", maxWidth: "600px" }}>
          Manage your active and past prescribed medications.
        </p>
      </header>

      <PrescriptionListClient initialPrescriptions={prescriptions} />
    </div>
  );
}
