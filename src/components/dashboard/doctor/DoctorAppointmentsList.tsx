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

export function DoctorAppointmentsList({ doctorId }: { doctorId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (!doctorId || !supabase) return;

    const fetchAppointments = async () => {
      let query = supabase
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
        .order("start_time", { ascending: false });

      if (dateFilter) {
        query = query
          .gte("start_time", `${dateFilter}T00:00:00Z`)
          .lte("start_time", `${dateFilter}T23:59:59Z`);
      }

      const { data } = await query;
      if (data) {
        setAppointments(data as unknown as Appointment[]);
      }
    };

    fetchAppointments();
  }, [doctorId, supabase, dateFilter]);

  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || appt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "checked_in":
        return "var(--accent-aqua)";
      case "scheduled":
        return "var(--accent-violet)";
      case "cancelled":
        return "rgba(255, 99, 132, 1)";
      default:
        return "var(--text-muted)";
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    // @ts-ignore: Supabase types for appointments might not be fully generated
    await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header id="overview" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Appointments
          </h1>
          <p className="text-muted dashboard-page__lead">
            Manage your daily schedule and all patient visits.
          </p>
        </div>
        
        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ position: "relative", width: "100%", minWidth: "250px" }}>
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="glass-input" 
              style={{ paddingLeft: "2.5rem", borderRadius: "99px" }} 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <svg style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            className="glass-input" 
            style={{ borderRadius: "99px", width: "auto" }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Scheduled</option>
            <option>Confirmed</option>
            <option>Checked_in</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <input 
            type="date" 
            className="glass-input" 
            style={{ borderRadius: "99px", width: "auto" }} 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </header>

      {/* Appointments List */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Time</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Patient</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Type</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem" }}>Status</th>
                <th style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "0.875rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "1rem 0", textAlign: "center", color: "var(--text-muted)" }}>
                    No appointments found.
                  </td>
                </tr>
              )}
              {filteredAppointments.map((appt) => {
                const dateObj = new Date(appt.start_time);
                return (
                  <tr key={appt.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "1rem 0" }}>
                      <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{dateObj.toLocaleDateString()}</div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{appt.profiles?.full_name || "Unknown"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{appt.reason} ({appt.mode === 'telehealth' ? 'Telehealth' : 'In-person'})</td>
                    <td>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: 600,
                        color: getStatusColor(appt.status),
                        background: "rgba(255,255,255,0.05)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "99px",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                        <button disabled className="btn btn-ghost" style={{ padding: "0.375rem 1rem", fontSize: "0.8125rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
                          Details
                        </button>
                        <button 
                          disabled={appt.status === "cancelled" || appt.status === "completed" || appt.status === "checked_in"}
                          onClick={() => updateStatus(appt.id, 'checked_in')}
                          className="btn" 
                          style={{ padding: "0.375rem 1rem", fontSize: "0.8125rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", opacity: appt.status === "cancelled" || appt.status === "completed" || appt.status === "checked_in" ? 0.5 : 1 }}
                        >
                          Check-In
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
