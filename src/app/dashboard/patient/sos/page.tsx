"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SOSPage() {
  const [emergency, setEmergency] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient()!;
  const router = useRouter();

  useEffect(() => {
    let channel: any;

    const fetchLatestSOS = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      // Get the most recent open or acknowledged emergency
      const { data } = await supabase
        .from("emergencies")
        .select("*")
        .eq("patient_id", session.user.id)
        .in("status", ["open", "acknowledged"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setEmergency(data);

        // Subscribe to changes to this specific emergency
        channel = supabase.channel(`public:emergencies:id=eq.${(data as any).id}`)
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "emergencies", filter: `id=eq.${(data as any).id}` },
            (payload) => {
              setEmergency(payload.new);
            }
          )
          .subscribe();
      }

      setIsLoading(false);
    };

    fetchLatestSOS();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, router]);

  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>Loading...</div>;
  }

  // If there's no active emergency, show a safe state
  if (!emergency || emergency.status === "resolved") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>No Active Emergencies</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>You do not have any open SOS requests.</p>
        <Link href="/dashboard/patient" className="btn btn-ghost" style={{ padding: "0.75rem 1.5rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "80vh",
      textAlign: "center"
    }}>
      <div style={{
        backgroundColor: emergency.status === "open" ? "rgba(255, 107, 107, 0.1)" : "rgba(255, 165, 2, 0.1)",
        border: `2px solid ${emergency.status === "open" ? "#ff6b6b" : "#ffa502"}`,
        borderRadius: "16px",
        padding: "3rem",
        maxWidth: "600px"
      }}>
        <div style={{ 
          width: "80px", 
          height: "80px", 
          backgroundColor: emergency.status === "open" ? "#ff6b6b" : "#ffa502", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          margin: "0 auto 1.5rem auto"
        }}>
          {emergency.status === "open" ? (
            <svg style={{ width: "40px", height: "40px", color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg style={{ width: "40px", height: "40px", color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h1 style={{ fontSize: "2.5rem", color: emergency.status === "open" ? "#ff6b6b" : "#ffa502", marginBottom: "1rem", textTransform: "uppercase" }}>
          {emergency.status === "open" ? "Emergency Alert Sent" : "Doctor Acknowledged"}
        </h1>
        
        <div style={{ fontSize: "1.25rem", color: "white", marginBottom: "2rem", lineHeight: 1.6 }}>
          {emergency.status === "open" ? (
            <p>Your doctor has been notified via email and dashboard alert. Waiting for acknowledgment...</p>
          ) : (
            <p>Dr. Pandey has seen your alert and is responding. Please keep your phone nearby.</p>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
          <a href="tel:911" className="btn" style={{ padding: "1rem 2rem", fontSize: "1.25rem", borderRadius: "99px", background: "transparent", border: "2px solid #ff6b6b", color: "#ff6b6b", fontWeight: "bold", textDecoration: "none" }}>
            Call 911 If Situation Worsens
          </a>
        </div>
        
        <Link href="/dashboard/patient" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
