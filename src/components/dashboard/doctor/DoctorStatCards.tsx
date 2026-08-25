"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface DoctorStatCardsProps {
  doctorId: string;
}

export function DoctorStatCards({ doctorId }: DoctorStatCardsProps) {
  const [todayCount, setTodayCount] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [revenue, setRevenue] = useState({ total: 0, cash: 0, upi: 0 });
  const supabase = createClient();

  useEffect(() => {
    if (!doctorId || !supabase) return;

    const fetchStats = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Fetch today's scheduled appointments
      const { count: todayApps } = await supabase
        .from("appointments")
        .select('*', { count: 'exact', head: true })
        .eq("doctor_id", doctorId)
        .gte("start_time", todayStart.toISOString())
        .lte("start_time", todayEnd.toISOString())
        .neq("status", "cancelled");

      if (todayApps !== null) {
        setTodayCount(todayApps);
      }

      // Fetch all appointments to calculate unique patients and revenue
      const { data: allAppointments } = await (supabase as any)
        .from("appointments")
        .select('patient_id, status, payment_amount, payment_method')
        .eq("doctor_id", doctorId);

      if (allAppointments) {
        // Unique patients
        const uniquePatients = new Set(allAppointments.map((a: any) => a.patient_id));
        setTotalPatients(uniquePatients.size);

        // Calculate Revenue
        let total = 0;
        let cash = 0;
        let upi = 0;

        allAppointments.filter((a: any) => a.status === 'completed').forEach((a: any) => {
          const amt = Number(a.payment_amount) || 0;
          total += amt;
          if (a.payment_method === 'upi') {
            upi += amt;
          } else {
            cash += amt; // default to cash
          }
        });

        setRevenue({ total, cash, upi });
      }
    };

    fetchStats();

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
          fetchStats();
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
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>{totalPatients}</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>All time</p>
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
        <p className="font-display" style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>₹{revenue.total.toLocaleString()}</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
          <span>Cash: ₹{revenue.cash.toLocaleString()}</span>
          <span>UPI: ₹{revenue.upi.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}
