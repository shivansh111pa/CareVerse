import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FileTextIcon } from "@/components/ui/Icons";

export const dynamic = 'force-dynamic';

export default async function RecordsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  const supabase = await createClient();
  let records: any[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('medical_records')
      .select(`
        id,
        diagnosis,
        notes,
        prescription,
        created_at,
        profiles!medical_records_doctor_id_fkey (
          full_name
        ),
        appointments (
          start_time,
          reason
        )
      `)
      .eq('patient_id', profile.id)
      .order('created_at', { ascending: false });
      
    if (data) {
      records = data;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Health Records
        </h1>
        <p className="text-muted">
          Access your medical history, diagnosis, and doctor notes.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {records.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "360px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--surface-subtle)", border: "2px solid var(--border-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)", marginBottom: "1rem" }}>
              <FileTextIcon style={{ width: 32, height: 32 }} />
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>No Records Found</h2>
            <p className="text-muted" style={{ maxWidth: "400px", fontSize: "0.9375rem" }}>Your doctor will add medical records and clinical notes here after your appointments.</p>
          </div>
        ) : (
          records.map((record) => {
            const dateObj = new Date(record.created_at);
            return (
              <div key={record.id} className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1.5px solid var(--border-dark)", paddingBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-forest)", marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>
                      {record.diagnosis || "Medical Consultation"}
                    </h3>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      Dr. {record.profiles?.full_name || "Shivansh A. Pandey"} • {dateObj.toLocaleDateString()}
                    </div>
                  </div>
                  <span className="clinic-stamp" style={{ fontSize: "0.75rem" }}>
                    Visit: {record.appointments?.reason || "General"}
                  </span>
                </div>
                
                {record.notes && (
                  <div>
                    <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.02em" }}>Clinical Notes</h4>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--text-secondary)" }}>{record.notes}</p>
                  </div>
                )}

                {record.prescription && (
                  <div>
                    <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.02em" }}>Prescription</h4>
                    <div style={{ padding: "1rem", background: "var(--surface-cream)", borderRadius: "8px", border: "1.5px solid var(--border-dark)", fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
                      {record.prescription}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
