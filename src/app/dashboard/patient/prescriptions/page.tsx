"use client";

import { useState } from "react";

export default function PrescriptionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mockPrescriptions = [
    {
      id: "Rx1",
      dateIssued: "Oct 14, 2024",
      doctor: "Dr. Emily Vance",
      status: "Active",
      primaryMedicine: "Amoxicillin 500mg",
      diagnosis: "Bacterial Sinusitis",
      notes: "Take with food. Complete the full course even if feeling better.",
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "1 capsule 3 times a day", duration: "7 days" },
        { name: "Ibuprofen", dosage: "400mg", frequency: "1 tablet every 6 hours as needed for pain/fever", duration: "3-5 days" }
      ]
    },
    {
      id: "Rx2",
      dateIssued: "Sep 20, 2024",
      doctor: "Dr. Miller",
      status: "Active",
      primaryMedicine: "Lisinopril 10mg",
      diagnosis: "Hypertension",
      notes: "Take once daily in the morning. Monitor blood pressure weekly.",
      medicines: [
        { name: "Lisinopril", dosage: "10mg", frequency: "1 tablet once a day", duration: "90 days" }
      ]
    },
    {
      id: "Rx3",
      dateIssued: "Feb 10, 2024",
      doctor: "Dr. Emily Vance",
      status: "Completed",
      primaryMedicine: "Azithromycin 250mg",
      diagnosis: "Upper Respiratory Tract Infection",
      notes: "Z-Pak. Take 2 tablets on day 1, then 1 tablet daily for 4 days.",
      medicines: [
        { name: "Azithromycin", dosage: "250mg", frequency: "As directed on pack", duration: "5 days" }
      ]
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Prescriptions
        </h1>
        <p className="text-muted">
          Manage your active and past medications.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {prescriptions.map((rx) => {
          const isExpanded = expandedId === rx.id;
          
          return (
            <div key={rx.id} className="glass-panel" style={{ padding: "0", overflow: "hidden", transition: "all 0.3s" }}>
              {/* Header / Collapsed State */}
              <div 
                onClick={() => toggleExpand(rx.id)}
                style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: isExpanded ? "rgba(255,255,255,0.02)" : "transparent" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{rx.primaryMedicine}</h3>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: 600,
                      color: rx.status === "Active" ? "var(--accent-aqua)" : "var(--text-muted)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "99px",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      {rx.status}
                    </span>
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
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
                <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Diagnosis</div>
                      <div style={{ fontWeight: 500 }}>{rx.diagnosis}</div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button disabled className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
                        Share on WhatsApp
                      </button>
                      <button disabled className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Prescription */}
                  <div style={{ marginTop: "2rem" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Medications</h4>
                    <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
                      {rx.rawPrescription}
                    </div>
                  </div>

                  {/* Notes */}
                  {rx.notes && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Doctor&apos;s Notes</div>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{rx.notes}</p>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
