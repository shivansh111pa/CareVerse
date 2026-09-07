"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { WritePrescriptionModal } from "./WritePrescriptionModal";

export function PatientPrescriptionsTab({
  patientId,
  doctorId,
  patientName,
  doctorName
}: {
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
}) {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient()!;

  const fetchPrescriptions = async () => {
    const { data } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    
    if (data) {
      setPrescriptions(data);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, supabase]);

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Prescriptions</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn" 
          style={{ fontSize: "0.75rem", padding: "0.5rem 1rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}
        >
          + Write Prescription
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {prescriptions.length === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No prescriptions found.</p>
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx.id} style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  {new Date(rx.created_at).toLocaleDateString()}
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "0.5rem" }}>
                  Diagnosis: {rx.diagnosis}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--accent-aqua)" }}>
                  {rx.medicines?.length || 0} Medicine(s) Prescribed
                </div>
              </div>
              <div>
                {rx.pdf_url && (
                  <a 
                    href={rx.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-ghost" 
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none" }}
                  >
                    View PDF
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <WritePrescriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        doctorId={doctorId}
        patientName={patientName}
        doctorName={doctorName}
        onComplete={() => {
          fetchPrescriptions();
        }}
      />
    </div>
  );
}
