"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface DoctorStatCardsProps {
  doctorId: string;
}

export function DoctorStatCards({ doctorId }: DoctorStatCardsProps) {
  const [todayCount, setTodayCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (!doctorId || !supabase) return;

    const fetchTodayAppointments = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { count } = await supabase
        .from("appointments")
        .select('*', { count: 'exact', head: true })
        .eq("doctor_id", doctorId)
        .gte("start_time", todayStart.toISOString())
        .lte("start_time", todayEnd.toISOString())
        .neq("status", "cancelled");

      if (count !== null) {
        setTodayCount(count);
      }
    };

    fetchTodayAppointments();

    const channel = supabase
      .channel("stat-appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `doctor_id=eq.${doctorId}`,
        },
        () => {
          fetchTodayAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, supabase]);

  return (
    <div className="stats-grid">
      {/* Total Patients */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Total Patients</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>0</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>-</p>
      </div>

      {/* Today's Appointments */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Today&apos;s Appointments</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>{todayCount}</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Scheduled</p>
      </div>

      {/* New Patients */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>New Patients</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>0</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>this week</p>
      </div>

      {/* Revenue */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Revenue</h3>
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>₹0</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>-</p>
      </div>
    </div>
  );
}
