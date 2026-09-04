"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Appointment {
  id: string;
  start_time: string;
  status: string;
  reason: string;
  mode: string;
  profiles: {
    full_name: string;
  };
}

interface NextAppointmentCardProps {
  patientId: string;
}

export function NextAppointmentCard({ patientId }: NextAppointmentCardProps) {
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!patientId || !supabase) return;

    const fetchNextAppointment = async () => {
      const now = new Date();

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          start_time,
          status,
          reason,
          mode,
          profiles!appointments_doctor_id_fkey (
            full_name
          )
        `)
        .eq("patient_id", patientId)
        .gte("start_time", now.toISOString())
        .in("status", ["scheduled", "confirmed"])
        .order("start_time", { ascending: true })
        .limit(1)
        .single();

      if (data) {
        setNextAppointment(data as unknown as Appointment);
      } else {
        setNextAppointment(null);
      }
    };

    fetchNextAppointment();

    const channel = supabase
      .channel("patient-appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          fetchNextAppointment();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId, supabase]);

  if (!nextAppointment) {
    return (
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "1rem" }}>Next Appointment</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No upcoming appointments.</p>
      </div>
    );
  }

  const startDate = new Date(nextAppointment.start_time);
  const isTelehealth = nextAppointment.mode === "telehealth";

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Next Appointment</h3>
      </div>
      <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>
        {nextAppointment.reason || "Visit"}
      </h4>
      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
        {nextAppointment.profiles?.full_name || "Doctor"}
      </p>
      
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
        <span>🕒</span> {startDate.toLocaleDateString()} @ {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        {isTelehealth && (
          <button className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}>
            🎥 Video Call
          </button>
        )}
      </div>
    </div>
  );
}
