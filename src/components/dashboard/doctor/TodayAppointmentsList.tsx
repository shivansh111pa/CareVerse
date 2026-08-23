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

interface TodayAppointmentsListProps {
  doctorId?: string;
}

export function TodayAppointmentsList({ doctorId }: TodayAppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!doctorId || !supabase) return;

    const fetchAppointments = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          start_time,
          status,
          reason,
          mode,
          profiles!appointments_patient_id_fkey (
            full_name
          )
        `)
        .eq("doctor_id", doctorId)
        .gte("start_time", todayStart.toISOString())
        .lte("start_time", todayEnd.toISOString())
        .order("start_time", { ascending: true });

      if (data) {
        setAppointments(data as unknown as Appointment[]);
      }
    };

    fetchAppointments();

    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `doctor_id=eq.${doctorId}`,
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, supabase]);

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem" }}>Upcoming Appointments (Today)</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        {appointments.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No appointments today.</p>
        ) : (
          appointments.map((appt, i) => (
            <div key={appt.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px", alignItems: "center", paddingBottom: "1rem", borderBottom: i === appointments.length - 1 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                {new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{appt.profiles?.full_name || "Unknown Patient"}</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{appt.reason || "Visit"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.75rem", color: appt.status === "confirmed" ? "var(--accent-aqua)" : "var(--accent-violet)" }}>
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>
                <button 
                  disabled={appt.status === 'checked_in' || appt.status === 'completed' || appt.status === 'cancelled'}
                  onClick={async () => {
                    if (supabase) {
                      await supabase.from('appointments').update({ status: 'checked_in' }).eq('id', appt.id);
                    }
                  }}
                  className="btn btn-ghost" 
                  style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.12)", height: "auto" }}>
                  {appt.status === 'checked_in' ? 'Checked In' : 'Check-In'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
