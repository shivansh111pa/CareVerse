"use client";

import { useState } from "react";
import { FileTextIcon } from "@/components/ui/Icons";

export default function PrescriptionListClient({ initialPrescriptions }: { initialPrescriptions: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {initialPrescriptions.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "360px" }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--surface-subtle)", border: "2px solid var(--border-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)", marginBottom: "1rem" }}>
            <FileTextIcon style={{ width: 32, height: 32 }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>No Prescriptions Found</h2>
          <p className="text-muted" style={{ maxWidth: "400px", fontSize: "0.9375rem" }}>Your doctor will issue official digital prescriptions after your consultation.</p>
        </div>
      ) : (
        initialPrescriptions.map((rx) => {
          const isExpanded = expandedId === rx.id;
          
          return (
            <div key={rx.id} className="glass-panel brutal-card" style={{ padding: "0", overflow: "hidden", transition: "all 0.3s" }}>
              {/* Header / Collapsed State */}
              <div 
                onClick={() => toggleExpand(rx.id)}
                style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: isExpanded ? "var(--surface-subtle)" : "transparent" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--accent-forest)" }}>
                      {rx.primaryMedicine || rx.diagnosis || "Prescription"}
                    </h3>
                    {rx.status && (
                      <span className={`clinic-stamp ${rx.status === 'Active' ? 'clinic-stamp--verified' : ''}`}>
                        {rx.status}
                      </span>
                    )}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 600 }}>
                    Prescribed by {rx.doctor} on {rx.dateIssued}
                  </div>
                </div>
                
                <div style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* Expanded State */}
              {isExpanded && (
                <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", borderTop: "2px solid var(--border-dark)", background: "var(--surface-cream)" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>Diagnosis</div>
                      <div style={{ fontWeight: 600 }}>{rx.diagnosis || "General Consultation"}</div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {rx.pdfUrl ? (
                        <>
                          <a href={`https://wa.me/?text=Here is my digital prescription from CareVerse: ${rx.pdfUrl}`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: "0.875rem" }}>
                            Share on WhatsApp
                          </a>
                          <a href={rx.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: "0.875rem" }}>
                            Download PDF
                          </a>
                        </>
                      ) : (
                        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>No PDF available</span>
                      )}
                    </div>
                  </div>

                  {/* Prescription Medications */}
                  <div style={{ marginTop: "2rem" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Medications</h4>
                    <div style={{ padding: "1rem", background: "var(--surface-card)", borderRadius: "var(--radius-btn)", border: "2px solid var(--border-dark)", fontSize: "0.9375rem" }}>
                      {rx.medicines && rx.medicines.length > 0 ? rx.medicines.map((med: any, i: number) => (
                        <div key={i} style={{ marginBottom: i !== rx.medicines.length - 1 ? "1rem" : 0, paddingBottom: i !== rx.medicines.length - 1 ? "1rem" : 0, borderBottom: i !== rx.medicines.length - 1 ? "1.5px solid var(--border-subtle)" : "none" }}>
                          <div style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{med.name}</div>
                          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", fontWeight: 600 }}>
                            {med.dosage} • {med.frequency} • {med.duration_days} days
                          </div>
                          {med.notes && (
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", fontWeight: 600 }}>Note: {med.notes}</div>
                          )}
                        </div>
                      )) : (
                        <div style={{ whiteSpace: "pre-wrap", fontWeight: 600 }}>{rx.notes || "See general notes"}</div>
                      )}
                    </div>
                  </div>

                  {/* General Notes */}
                  {rx.notes && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--surface-accent)", borderRadius: "var(--radius-btn)", border: "2px solid var(--border-dark)" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-primary)", marginBottom: "0.25rem", fontWeight: 700 }}>Doctor&apos;s Notes</div>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.5, fontWeight: 600 }}>{rx.notes}</p>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
