"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  reasonForVisit: string;
  onComplete: () => void;
}

export function MedicalRecordModal({
  isOpen,
  onClose,
  appointmentId,
  patientId,
  doctorId,
  patientName,
  reasonForVisit,
  onComplete
}: MedicalRecordModalProps) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!diagnosis.trim()) {
      setError("Diagnosis is required");
      return;
    }

    setSaving(true);
    setError("");

    if (!supabase) {
      setError("Database connection not initialized");
      setSaving(false);
      return;
    }

    try {
      // Create medical record
      const { error: recordError } = await supabase!.from('medical_records').insert({
        appointment_id: appointmentId,
        patient_id: patientId,
        doctor_id: doctorId,
        diagnosis,
        notes,
        prescription
      } as any);

      if (recordError) {
        // If it's a unique constraint violation, they might have already created one
        if (recordError.code === '23505') {
          setError("A medical record already exists for this appointment.");
        } else {
          throw recordError;
        }
        setSaving(false);
        return;
      }

      // Update appointment status to completed
      const { error: statusError } = await supabase!
        .from('appointments')
        .update({ status: 'completed' } as any)
        .eq('id', appointmentId);

      if (statusError) throw statusError;

      onComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save medical record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "600px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Medical Record</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>&times;</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Patient</div>
          <div style={{ fontWeight: 500 }}>{patientName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Reason for Visit</div>
          <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.875rem" }}>
            {reasonForVisit || "Not specified"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && <div style={{ color: "var(--accent-red)", fontSize: "0.875rem", background: "rgba(255,0,0,0.1)", padding: "0.75rem", borderRadius: "8px" }}>{error}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Diagnosis *</label>
            <input 
              type="text" 
              value={diagnosis} 
              onChange={e => setDiagnosis(e.target.value)}
              className="glass-input" 
              placeholder="Primary diagnosis..." 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Clinical Notes</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              className="glass-input" 
              placeholder="Observations, symptoms, etc..." 
              rows={4}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Prescription</label>
            <textarea 
              value={prescription} 
              onChange={e => setPrescription(e.target.value)}
              className="glass-input" 
              placeholder="Medications and dosages..." 
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: "0.5rem 1rem", borderRadius: "99px" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn" style={{ padding: "0.5rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
            {saving ? "Saving..." : "Save & Complete Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
