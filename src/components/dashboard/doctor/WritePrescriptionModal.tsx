"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { pdf } from "@react-pdf/renderer";
import { PrescriptionPDF } from "@/components/pdf/PrescriptionPDF";

interface WritePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  onComplete: () => void;
}

export function WritePrescriptionModal({
  isOpen,
  onClose,
  appointmentId,
  patientId,
  doctorId,
  patientName,
  doctorName,
  onComplete
}: WritePrescriptionModalProps) {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration_days: "", notes: "" }
  ]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient()!;

  if (!isOpen) return null;

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration_days: "", notes: "" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedicines(newMeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 1. Generate PDF
      const pdfBlob = await pdf(
        <PrescriptionPDF
          doctorName={doctorName}
          patientName={patientName}
          date={new Date().toLocaleDateString()}
          diagnosis={diagnosis}
          medicines={medicines}
          generalNotes={generalNotes}
        />
      ).toBlob();

      // 2. Upload to Supabase Storage
      const prescriptionId = crypto.randomUUID();
      const fileName = `${patientId}/${prescriptionId}.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from("prescriptions")
        .upload(fileName, pdfBlob, {
          contentType: "application/pdf",
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("prescriptions")
        .getPublicUrl(fileName);

      // 3. Save to database
      // @ts-ignore
      const { data: newPrescription, error: dbError } = await supabase.from("prescriptions" as any).insert({
        id: prescriptionId,
        appointment_id: appointmentId || null,
        doctor_id: doctorId,
        patient_id: patientId,
        diagnosis,
        medicines,
        general_notes: generalNotes,
        pdf_url: publicUrl,
        status: "Active"
      } as any).select().single()!;

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      onComplete();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate or save prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{ 
        width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto",
        padding: "2rem", position: "relative"
      }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "white", cursor: "pointer" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>Write Prescription</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginBottom: "2rem" }}>
          Prescribing for: <strong style={{ color: "var(--text-primary)" }}>{patientName}</strong>
        </p>

        {error && (
          <div style={{ backgroundColor: "rgba(255, 99, 132, 0.2)", color: "#ff6384", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Diagnosis */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Diagnosis</label>
            <input 
              type="text" 
              required
              className="glass-input" 
              style={{ width: "100%" }}
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Bronchitis"
            />
          </div>

          {/* Medicines */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>Medicines</label>
              <button 
                type="button" 
                onClick={handleAddMedicine}
                className="btn btn-secondary" 
                style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
              >
                + Add Medicine
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {medicines.map((med, index) => (
                <div key={index} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", position: "relative" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Medicine Name</label>
                    <input 
                      type="text" required
                      className="glass-input" style={{ width: "100%", padding: "0.5rem" }}
                      value={med.name} onChange={e => handleMedicineChange(index, "name", e.target.value)}
                      placeholder="e.g. Amoxicillin 500mg"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Dosage</label>
                    <input 
                      type="text" required
                      className="glass-input" style={{ width: "100%", padding: "0.5rem" }}
                      value={med.dosage} onChange={e => handleMedicineChange(index, "dosage", e.target.value)}
                      placeholder="e.g. 1 Tablet"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Frequency</label>
                    <input 
                      type="text" required
                      className="glass-input" style={{ width: "100%", padding: "0.5rem" }}
                      value={med.frequency} onChange={e => handleMedicineChange(index, "frequency", e.target.value)}
                      placeholder="e.g. Twice a day"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Duration (Days)</label>
                    <input 
                      type="number" required min="1"
                      className="glass-input" style={{ width: "100%", padding: "0.5rem" }}
                      value={med.duration_days} onChange={e => handleMedicineChange(index, "duration_days", e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Notes (Optional)</label>
                    <input 
                      type="text"
                      className="glass-input" style={{ width: "100%", padding: "0.5rem" }}
                      value={med.notes} onChange={e => handleMedicineChange(index, "notes", e.target.value)}
                      placeholder="e.g. After meals"
                    />
                  </div>
                  
                  {medicines.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMedicine(index)}
                      style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#ff6384", cursor: "pointer", fontSize: "0.75rem" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* General Notes */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem" }}>General Notes (Optional)</label>
            <textarea 
              className="glass-input" 
              style={{ width: "100%", minHeight: "80px", resize: "vertical" }}
              value={generalNotes}
              onChange={e => setGeneralNotes(e.target.value)}
              placeholder="Any additional advice for the patient..."
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-ghost" 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating PDF..." : "Generate & Issue Prescription"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
