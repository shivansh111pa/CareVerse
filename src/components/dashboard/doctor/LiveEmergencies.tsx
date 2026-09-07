"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function LiveEmergencies() {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const supabase = createClient();

  const fetchEmergencies = async () => {
    const { data } = await supabase
      .from("emergencies")
      .select(`
        id,
        patient_id,
        status,
        created_at,
        profiles!emergencies_patient_id_fkey (
          full_name,
          phone
        )
      `)
      .in("status", ["open", "acknowledged"])
      .order("created_at", { ascending: false });

    if (data) {
      setEmergencies(data);
    }
  };

  useEffect(() => {
    fetchEmergencies();

    // Subscribe to all changes in the emergencies table
    const channel = supabase.channel("public:emergencies")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergencies" },
        (payload) => {
          // Re-fetch to get the joined profile data easily,
          // or we could optimistically update if we had it.
          // Since emergencies are low volume, a re-fetch is safest.
          fetchEmergencies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("emergencies")
      .update({ 
        status: newStatus,
        ...(newStatus === "resolved" ? { resolved_at: new Date().toISOString() } : {})
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update emergency:", error);
      alert("Failed to update status");
    }
  };

  if (emergencies.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {emergencies.map((em) => (
        <div key={em.id} className="glass-panel brutal-card" style={{ 
          padding: "1.5rem", 
          border: `2px solid var(--border-dark)`,
          backgroundColor: em.status === "open" ? "var(--accent-terracotta-light)" : "var(--accent-yellow-light)",
          position: "relative",
          overflow: "hidden"
        }}>
          {em.status === "open" && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "var(--accent-terracotta)", animation: "pulse 2s infinite" }} />
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                <div style={{ 
                  width: "12px", height: "12px", borderRadius: "50%", 
                  backgroundColor: em.status === "open" ? "var(--accent-terracotta)" : "var(--accent-yellow)",
                  boxShadow: em.status === "open" ? "0 0 8px var(--accent-terracotta)" : "none",
                  border: "1.5px solid var(--border-dark)"
                }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: em.status === "open" ? "var(--accent-terracotta)" : "var(--accent-yellow)", textTransform: "uppercase" }}>
                  SOS {em.status}
                </h3>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Triggered at: {new Date(em.created_at).toLocaleTimeString()}
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {em.status === "open" && (
                <button 
                  onClick={() => handleUpdateStatus(em.id, "acknowledged")}
                  className="btn" 
                  style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-btn)", background: "var(--accent-yellow)", color: "#000", fontWeight: 700, border: "2px solid var(--border-dark)", boxShadow: "var(--shadow-brutal-sm)" }}
                >
                  Acknowledge
                </button>
              )}
              <button 
                onClick={() => handleUpdateStatus(em.id, "resolved")}
                className="btn btn-ghost" 
                style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-btn)", border: "2px solid var(--border-dark)" }}
              >
                Resolve
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Patient: {em.profiles?.full_name || "Unknown"}
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              Phone: {em.profiles?.phone || "Not provided"}
            </div>
            <Link 
              href={`/dashboard/doctor/patients/${em.patient_id}`}
              className="btn"
              style={{ display: "inline-block", padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "99px", background: "var(--text-bright)", color: "#000", textDecoration: "none", fontWeight: 600 }}
            >
              View Full Profile
            </Link>
          </div>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  );
}
