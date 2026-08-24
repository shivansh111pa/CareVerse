"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Doctor {
  id: string;
  full_name: string;
}

interface Rule {
  weekday: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
}

interface Exception {
  date: string;
  is_closed: boolean;
  custom_start: string | null;
  custom_end: string | null;
}

interface BookAppointmentFormProps {
  patientId: string;
}

export function BookAppointmentForm({ patientId }: BookAppointmentFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<"in_person" | "telehealth">("in_person");
  const [reason, setReason] = useState("");
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch doctors
  useEffect(() => {
    if (!supabase) return;
    const fetchDoctors = async () => {
      const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'doctor');
      if (data && data.length > 0) {
        const docs = data as any[];
        setDoctors(docs);
        setSelectedDoctorId(docs[0].id);
      }
    };
    fetchDoctors();
  }, [supabase]);

  // Compute slots
  useEffect(() => {
    if (!supabase || !selectedDoctorId || !date) return;

    const fetchAvailabilityAndCompute = async () => {
      setAvailableSlots([]);
      setSelectedSlot(null);

      // Parse date safely in local time to avoid timezone offset issues (e.g., UTC midnight becoming previous day in US timezones)
      const [year, month, day] = date.split('-');
      const dayOfWeek = new Date(Number(year), Number(month) - 1, Number(day)).getDay();

      // 1. Get rules for weekday
      const { data: rulesData } = await supabase
        .from('availability_rules')
        .select('*')
        .eq('doctor_id', selectedDoctorId)
        .eq('weekday', dayOfWeek);
      const rules = rulesData as any[];

      // 2. Get exception for date
      const { data: exceptionsData } = await supabase
        .from('availability_exceptions')
        .select('*')
        .eq('doctor_id', selectedDoctorId)
        .eq('date', date)
        .limit(1)
        .single();
      const exceptions = exceptionsData as any;

      if (exceptions?.is_closed || (!rules?.length && !exceptions?.custom_start)) {
        return; // Closed or no rules
      }

      // 3. Get existing appointments for the date
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('start_time')
        .eq('doctor_id', selectedDoctorId)
        .gte('start_time', `${date}T00:00:00Z`)
        .lte('start_time', `${date}T23:59:59Z`)
        .neq('status', 'cancelled');
      const appointments = appointmentsData as any[];

      const bookedTimes = new Set((appointments || []).map(appt => {
        const d = new Date(appt.start_time);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      }));

      // Determine time blocks
      const timeBlocks = [];
      if (exceptions?.custom_start && exceptions?.custom_end) {
        timeBlocks.push({
          start_time: exceptions.custom_start,
          end_time: exceptions.custom_end,
          duration: 30 // hardcoded default for exceptions if missing
        });
      } else if (rules) {
        rules.forEach(r => {
          timeBlocks.push({
            start_time: r.start_time,
            end_time: r.end_time,
            duration: r.slot_duration_minutes || 30
          });
        });
      }

      // Generate slots
      const slots: string[] = [];
      
      timeBlocks.forEach(block => {
        const [startHour, startMin] = block.start_time.split(':').map(Number);
        const [endHour, endMin] = block.end_time.split(':').map(Number);
        
        let currentMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        while (currentMinutes + block.duration <= endMinutes) {
          const h = Math.floor(currentMinutes / 60);
          const m = currentMinutes % 60;
          const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          
          // Also check if time is in past if today
          const slotDate = new Date(`${date}T${timeStr}:00`);
          const now = new Date();
          
          if (!bookedTimes.has(timeStr) && slotDate > now) {
            slots.push(timeStr);
          }
          currentMinutes += block.duration;
        }
      });

      // Deduplicate and sort
      const uniqueSlots = Array.from(new Set(slots)).sort();
      setAvailableSlots(uniqueSlots);
    };

    fetchAvailabilityAndCompute();

    const channel = supabase
      .channel('appointments-slots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `doctor_id=eq.${selectedDoctorId}` }, fetchAvailabilityAndCompute)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, selectedDoctorId, date]);

  const handleConfirm = async () => {
    if (!supabase || !selectedDoctorId || !date || !selectedSlot) return;
    setIsSubmitting(true);
    
    // Create timestamp string in ISO format for timezone safety
    // Using local time to UTC depending on browser
    const startObj = new Date(`${date}T${selectedSlot}:00`);
    const endObj = new Date(startObj.getTime() + 30 * 60000); // assume 30 min if we don't fetch duration again

    const { error } = await supabase.from('appointments').insert({
      doctor_id: selectedDoctorId,
      patient_id: patientId,
      start_time: startObj.toISOString(),
      end_time: endObj.toISOString(),
      status: 'scheduled',
      reason: reason,
      mode: mode
    } as any);

    setIsSubmitting(false);

    if (!error) {
      // Hit Nodemailer API endpoint
      fetch('/api/appointments/confirm', { method: 'POST', body: JSON.stringify({ patientId, doctorId: selectedDoctorId, date, time: selectedSlot }) });
      router.push('/dashboard/patient/appointments');
    } else {
      alert("Error booking appointment. Someone might have booked this slot.");
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Doctor & Date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Doctor</label>
          <select 
            value={selectedDoctorId} 
            onChange={e => setSelectedDoctorId(e.target.value)}
            className="glass-input" 
            style={{ borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "0.75rem" }}
          >
            {doctors.map(d => <option key={d.id} value={d.id} style={{ color: "black" }}>{d.full_name}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Date</label>
          <input 
            type="date" 
            className="glass-input" 
            value={date}
            onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{ borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* Visit Type */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Visit Type</label>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "99px", padding: "0.25rem", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "400px" }}>
          <button 
            onClick={() => setMode("in_person")}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "99px", background: mode === "in_person" ? "var(--accent-aqua)" : "transparent", color: mode === "in_person" ? "#000" : "var(--text-bright)", fontWeight: mode === "in_person" ? 600 : 400, border: "none", fontSize: "0.875rem", cursor: "pointer" }}
          >
            In-Person
          </button>
          <button 
            onClick={() => setMode("telehealth")}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "99px", background: mode === "telehealth" ? "var(--accent-aqua)" : "transparent", color: mode === "telehealth" ? "#000" : "var(--text-bright)", fontWeight: mode === "telehealth" ? 600 : 400, border: "none", fontSize: "0.875rem", cursor: "pointer" }}
          >
            Telehealth
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Available Times</label>
        {availableSlots.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No available slots for this date.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.75rem" }}>
            {availableSlots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: isSelected ? "rgba(255, 255, 255, 0.15)" : "rgba(255,255,255,0.05)",
                    color: isSelected ? "var(--accent-aqua)" : "var(--text-bright)",
                    border: isSelected ? "1px solid var(--accent-aqua)" : "1px solid rgba(255,255,255,0.1)",
                    fontSize: "0.875rem",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  {(() => {
                    const [h, m] = slot.split(':');
                    const d = new Date();
                    d.setHours(parseInt(h, 10));
                    d.setMinutes(parseInt(m, 10));
                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  })()}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Reason */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Reason for Visit</label>
        <textarea 
          className="glass-input" 
          placeholder="Please briefly describe your symptoms or reason for visit..."
          rows={4}
          style={{ resize: "none", borderRadius: "12px" }}
          value={reason}
          onChange={e => setReason(e.target.value)}
        ></textarea>
      </div>

      {/* Confirm */}
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
        <button 
          disabled={!selectedSlot || !selectedDoctorId || isSubmitting}
          onClick={handleConfirm}
          className="btn" 
          style={{ padding: "0.75rem 2rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", fontSize: "1rem", cursor: (!selectedSlot || !selectedDoctorId || isSubmitting) ? "not-allowed" : "pointer", opacity: (!selectedSlot || !selectedDoctorId || isSubmitting) ? 0.5 : 1 }}
        >
          {isSubmitting ? "Booking..." : "Confirm Appointment"}
        </button>
      </div>

    </div>
  );
}
