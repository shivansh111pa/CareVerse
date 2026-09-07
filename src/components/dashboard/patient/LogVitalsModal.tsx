"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LogVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onComplete: () => void;
}

export function LogVitalsModal({ isOpen, onClose, patientId, onComplete }: LogVitalsModalProps) {
  const [heartRate, setHeartRate] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [steps, setSteps] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    setError("");

    if (!supabase) {
      setError("Database connection not initialized");
      setSaving(false);
      return;
    }

    try {
      const { error: insertError } = await (supabase as any).from('vitals').insert({
        patient_id: patientId,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        blood_pressure_systolic: bpSystolic ? parseInt(bpSystolic) : null,
        blood_pressure_diastolic: bpDiastolic ? parseInt(bpDiastolic) : null,
        steps: steps ? parseInt(steps) : null
      });

      if (insertError) throw insertError;

      onComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log vitals");
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
      <div className="glass-panel" style={{ width: "100%", maxWidth: "500px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Log Health Vitals</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>&times;</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && <div style={{ color: "var(--accent-red)", fontSize: "0.875rem", background: "rgba(255,0,0,0.1)", padding: "0.75rem", borderRadius: "8px" }}>{error}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Heart Rate (bpm)</label>
            <input 
              type="number" 
              value={heartRate} 
              onChange={e => setHeartRate(e.target.value)}
              className="glass-input" 
              placeholder="e.g. 72" 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>BP Systolic</label>
              <input 
                type="number" 
                value={bpSystolic} 
                onChange={e => setBpSystolic(e.target.value)}
                className="glass-input" 
                placeholder="e.g. 120" 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>BP Diastolic</label>
              <input 
                type="number" 
                value={bpDiastolic} 
                onChange={e => setBpDiastolic(e.target.value)}
                className="glass-input" 
                placeholder="e.g. 80" 
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Steps</label>
            <input 
              type="number" 
              value={steps} 
              onChange={e => setSteps(e.target.value)}
              className="glass-input" 
              placeholder="e.g. 10000" 
            />
          </div>

        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.875rem" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}>
            {saving ? "Saving..." : "Save Vitals"}
          </button>
        </div>
      </div>
    </div>
  );
}
