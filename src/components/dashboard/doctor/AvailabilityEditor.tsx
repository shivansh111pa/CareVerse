"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Rule {
  id?: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
}

interface Exception {
  id: string;
  date: string;
  is_closed: boolean;
  custom_start: string | null;
  custom_end: string | null;
}

const daysOfWeek = [
  { name: "Sunday", val: 0 },
  { name: "Monday", val: 1 },
  { name: "Tuesday", val: 2 },
  { name: "Wednesday", val: 3 },
  { name: "Thursday", val: 4 },
  { name: "Friday", val: 5 },
  { name: "Saturday", val: 6 },
];

export function AvailabilityEditor({ doctorId }: { doctorId: string }) {
  const supabase = createClient();

  const [rules, setRules] = useState<Record<number, Rule[]>>({});
  const [activeDays, setActiveDays] = useState<Record<number, boolean>>({});
  
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  
  const [exDate, setExDate] = useState("");
  const [exStart, setExStart] = useState("09:00");
  const [exEnd, setExEnd] = useState("17:00");
  const [exClosed, setExClosed] = useState(false);

  useEffect(() => {
    if (!doctorId || !supabase) return;

    const fetchData = async () => {
      const { data: rulesData } = await supabase.from("availability_rules").select("*").eq("doctor_id", doctorId).order("start_time");
      
      const newRules: Record<number, Rule[]> = {};
      const newActive: Record<number, boolean> = {};
      
      // Initialize with defaults if empty
      if (!rulesData || rulesData.length === 0) {
        daysOfWeek.forEach(d => {
          if (d.val >= 1 && d.val <= 5) {
            newRules[d.val] = [
              { weekday: d.val, start_time: "10:00", end_time: "13:00", slot_duration_minutes: 30 },
              { weekday: d.val, start_time: "17:00", end_time: "22:00", slot_duration_minutes: 30 }
            ];
            newActive[d.val] = true;
          } else if (d.val === 6) {
            newRules[d.val] = [
              { weekday: d.val, start_time: "10:00", end_time: "13:00", slot_duration_minutes: 30 }
            ];
            newActive[d.val] = true;
          } else {
            newRules[d.val] = [];
            newActive[d.val] = false;
          }
        });
      } else {
        // Build from database
        daysOfWeek.forEach(d => {
          newRules[d.val] = [];
          newActive[d.val] = false;
        });
        
        rulesData.forEach((r: any) => {
          newRules[r.weekday].push(r);
          newActive[r.weekday] = true;
        });
        
        // Ensure every active day has at least one empty rule if it somehow got corrupted
        daysOfWeek.forEach(d => {
          if (newActive[d.val] && newRules[d.val].length === 0) {
            newRules[d.val] = [{ weekday: d.val, start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30 }];
          }
          if (!newActive[d.val] && newRules[d.val].length === 0) {
            newRules[d.val] = [{ weekday: d.val, start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30 }];
          }
        });
      }

      setRules(newRules);
      setActiveDays(newActive);

      const { data: exceptionsData } = await supabase.from("availability_exceptions").select("*").eq("doctor_id", doctorId).order("date", { ascending: true });
      if (exceptionsData) setExceptions(exceptionsData);
    };

    fetchData();
  }, [doctorId, supabase]);

  const handleSaveWeekly = async () => {
    if (!supabase) return;
    
    // First, delete existing
    await supabase.from("availability_rules").delete().eq("doctor_id", doctorId);
    
    // Then insert active
    const toInsert: any[] = [];
    
    daysOfWeek.forEach(d => {
      if (activeDays[d.val]) {
        rules[d.val].forEach(shift => {
          toInsert.push({
            doctor_id: doctorId,
            weekday: d.val,
            start_time: shift.start_time,
            end_time: shift.end_time,
            slot_duration_minutes: 30
          });
        });
      }
    });

    if (toInsert.length > 0) {
      await supabase.from("availability_rules").insert(toInsert as any);
    }
    alert("Weekly schedule saved!");
  };

  const handleAddShift = (weekday: number) => {
    setRules(prev => ({
      ...prev,
      [weekday]: [...prev[weekday], { weekday, start_time: "12:00", end_time: "13:00", slot_duration_minutes: 30 }]
    }));
  };

  const handleRemoveShift = (weekday: number, index: number) => {
    setRules(prev => {
      const newShifts = [...prev[weekday]];
      newShifts.splice(index, 1);
      return { ...prev, [weekday]: newShifts };
    });
  };

  const handleUpdateShift = (weekday: number, index: number, field: "start_time" | "end_time", value: string) => {
    setRules(prev => {
      const newShifts = [...prev[weekday]];
      newShifts[index] = { ...newShifts[index], [field]: value };
      return { ...prev, [weekday]: newShifts };
    });
  };

  const handleAddOverride = async () => {
    if (!supabase || !exDate) return;
    
    const { data, error } = await supabase.from("availability_exceptions").insert({
      doctor_id: doctorId,
      date: exDate,
      is_closed: exClosed,
      custom_start: exClosed ? null : exStart,
      custom_end: exClosed ? null : exEnd
    } as any).select().single();

    if (data) {
      setExceptions([...exceptions, data]);
      setExDate("");
      setExClosed(false);
    } else {
      alert("Error adding override");
    }
  };

  const handleDeleteOverride = async (id: string) => {
    if (!supabase) return;
    await supabase.from("availability_exceptions").delete().eq("id", id);
    setExceptions(exceptions.filter(e => e.id !== id));
  };

  return (
    <div className="dashboard-grid">
      {/* Weekly Availability */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Weekly Schedule</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {daysOfWeek.map((day) => {
            const isActive = activeDays[day.val];
            const dayShifts = rules[day.val] || [];
            
            return (
              <div key={day.name} style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "start", gap: "1rem", paddingBottom: "1.5rem", borderBottom: day.name === "Saturday" ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontWeight: 500, paddingTop: "0.5rem" }}>{day.name}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.875rem", color: isActive ? "var(--accent-aqua)" : "var(--text-muted)" }}>{isActive ? "Open" : "Closed"}</span>
                    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isActive}
                        onChange={e => {
                          const newActive = e.target.checked;
                          setActiveDays({...activeDays, [day.val]: newActive});
                          // If activating and no shifts exist, add a default one
                          if (newActive && dayShifts.length === 0) {
                            handleAddShift(day.val);
                          }
                        }}
                      />
                      <div style={{ width: "40px", height: "24px", background: isActive ? "var(--accent-aqua)" : "rgba(255,255,255,0.1)", borderRadius: "12px", position: "relative" }}>
                        <div style={{ position: "absolute", left: isActive ? "18px" : "2px", top: "2px", width: "20px", height: "20px", background: isActive ? "#000" : "var(--text-muted)", borderRadius: "50%", transition: "all 0.3s" }}></div>
                      </div>
                    </label>
                  </div>
                  
                  {isActive && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {dayShifts.map((shift, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                          <input 
                            type="time" 
                            value={shift.start_time.substring(0,5)} 
                            onChange={e => handleUpdateShift(day.val, idx, "start_time", e.target.value)}
                            className="glass-input" 
                            style={{ width: "auto", padding: "0.25rem 0.75rem" }} 
                          />
                          <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>to</span>
                          <input 
                            type="time" 
                            value={shift.end_time.substring(0,5)} 
                            onChange={e => handleUpdateShift(day.val, idx, "end_time", e.target.value)}
                            className="glass-input" 
                            style={{ width: "auto", padding: "0.25rem 0.75rem" }} 
                          />
                          <button 
                            onClick={() => handleRemoveShift(day.val, idx)}
                            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}
                            title="Remove shift"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => handleAddShift(day.val)}
                        className="btn btn-ghost" 
                        style={{ alignSelf: "flex-start", padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "99px", border: "1px dashed rgba(255,255,255,0.2)", marginTop: "0.25rem" }}
                      >
                        + Add Shift
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button onClick={handleSaveWeekly} className="btn" style={{ padding: "0.5rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Save Weekly Schedule
          </button>
        </div>
      </div>

      {/* Custom Hours / Overrides */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>Date Overrides</h2>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>Mark specific dates as closed or set custom hours.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Select Date</label>
          <input 
            type="date" 
            className="glass-input" 
            value={exDate}
            onChange={e => setExDate(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Start Time</label>
            <input type="time" className="glass-input" value={exStart} onChange={e => setExStart(e.target.value)} disabled={exClosed} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>End Time</label>
            <input type="time" className="glass-input" value={exEnd} onChange={e => setExEnd(e.target.value)} disabled={exClosed} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" id="mark-closed" checked={exClosed} onChange={e => setExClosed(e.target.checked)} style={{ width: "1rem", height: "1rem" }} />
          <label htmlFor="mark-closed" style={{ fontSize: "0.875rem" }}>Mark as closed all day</label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "1rem" }}>
          <button onClick={handleAddOverride} disabled={!exDate} className="btn btn-ghost" style={{ padding: "0.5rem 1.5rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", cursor: exDate ? "pointer" : "not-allowed", opacity: exDate ? 1 : 0.5 }}>
            Add Override
          </button>
        </div>
        
        {/* List of existing overrides */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "1rem" }}>Upcoming Overrides</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {exceptions.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No overrides set.</p>}
            {exceptions.map(ex => (
              <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{new Date(ex.date).toLocaleDateString()}</div>
                  <div style={{ fontSize: "0.75rem", color: ex.is_closed ? "var(--accent-violet)" : "var(--accent-aqua)" }}>
                    {ex.is_closed ? "Closed All Day" : `Open: ${ex.custom_start?.substring(0,5)} - ${ex.custom_end?.substring(0,5)}`}
                  </div>
                </div>
                <button onClick={() => handleDeleteOverride(ex.id)} style={{ color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}>✕</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
