"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function UrgentSymptomChecks() {
  const [urgentChecks, setUrgentChecks] = useState<any[]>([]);
  const supabase = createClient()!;

  useEffect(() => {
    const fetchUrgentChecks = async () => {
      const { data } = await supabase
        .from("symptom_checks")
        .select(`
          id,
          input_text,
          ai_response,
          urgency_level,
          created_at,
          patient_id,
          profiles!symptom_checks_patient_id_fkey (
            full_name
          )
        `)
        .in("urgency_level", ["high", "emergency"])
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        setUrgentChecks(data);
      }
    };

    fetchUrgentChecks();

    // Optionally set up a realtime subscription here to alert doctors immediately.
  }, [supabase]);

  if (urgentChecks.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderLeft: "4px solid #ff6b6b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#ff6b6b" }}>Urgent Triage Alerts</h3>
        <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(255, 107, 107, 0.2)", color: "#ff6b6b", padding: "0.25rem 0.5rem", borderRadius: "99px", fontWeight: "bold" }}>
          {urgentChecks.length} New
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {urgentChecks.map(check => (
          <div key={check.id} style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{check.profiles?.full_name || "Unknown Patient"}</span>
              <span style={{ 
                fontSize: "0.75rem", 
                fontWeight: 600, 
                color: check.urgency_level === "emergency" ? "#ff4757" : "#ffa502",
                textTransform: "uppercase"
              }}>
                {check.urgency_level}
              </span>
            </div>
            
            <p style={{ fontSize: "0.875rem", color: "var(--text-bright)", marginBottom: "0.5rem", fontStyle: "italic" }}>
              &quot;{check.input_text.length > 60 ? check.input_text.substring(0, 60) + "..." : check.input_text}&quot;
            </p>

            {check.ai_response?.causes && check.ai_response.causes.length > 0 && (
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                AI Suggested: {check.ai_response.causes.slice(0,2).join(", ")}
              </div>
            )}

            <Link 
              href={`/dashboard/doctor/patients/${check.patient_id}`}
              className="btn btn-ghost" 
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", display: "inline-block" }}
            >
              View Patient Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
