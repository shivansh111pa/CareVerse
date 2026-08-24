import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>No Records Found</h2>
            <p className="text-muted" style={{ maxWidth: "400px" }}>Your doctor will add medical records here after your appointments.</p>
          </div>
        ) : (
          records.map((record) => {
            const dateObj = new Date(record.created_at);
            return (
              <div key={record.id} className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--accent-aqua)", marginBottom: "0.25rem" }}>{record.diagnosis}</h3>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Dr. {record.profiles?.full_name} • {dateObj.toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: "0.875rem", background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "99px" }}>
                    Visit: {record.appointments?.reason || "General"}
                  </div>
                </div>
                
                {record.notes && (
                  <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Clinical Notes</h4>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{record.notes}</p>
                  </div>
                )}

                {record.prescription && (
                  <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Prescription</h4>
                    <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
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
