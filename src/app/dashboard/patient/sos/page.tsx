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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh", textAlign: "center", padding: "2rem" }}>
        <div style={{
          background: "var(--surface-card, #ffffff)",
          border: "2px solid var(--border-dark, #122820)",
          boxShadow: "var(--shadow-brutal, 3.5px 3.5px 0px #122820)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          maxWidth: "480px",
          width: "100%"
        }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary, #122820)", marginBottom: "0.75rem" }}>No Active Emergencies</h1>
          <p style={{ color: "var(--text-secondary, #3b4e47)", fontSize: "1rem", marginBottom: "2rem" }}>You do not have any open SOS requests.</p>
          <Link href="/dashboard/patient" className="btn btn-primary" style={{ display: "inline-block", padding: "0.75rem 1.75rem", borderRadius: "10px", textDecoration: "none" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isAlertOpen = emergency.status === "open";
  const themeColor = isAlertOpen ? "var(--accent-terracotta, #e05a38)" : "var(--accent-yellow, #f59e0b)";

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "75vh",
      textAlign: "center",
      padding: "2rem"
    }}>
      <div style={{
        backgroundColor: "var(--surface-card, #ffffff)",
        border: `3px solid var(--border-dark, #122820)`,
        boxShadow: `6px 6px 0px ${themeColor}`,
        borderRadius: "16px",
        padding: "3rem 2.5rem",
        maxWidth: "560px",
        width: "100%"
      }}>
        <div style={{ 
          width: "72px", 
          height: "72px", 
          backgroundColor: themeColor, 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          margin: "0 auto 1.5rem auto",
          border: "2px solid var(--border-dark, #122820)",
          boxShadow: "var(--shadow-brutal-sm, 2px 2px 0px #122820)"
        }}>
          {isAlertOpen ? (
            <svg style={{ width: "36px", height: "36px", color: "#ffffff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg style={{ width: "36px", height: "36px", color: "#ffffff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: themeColor, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
          {isAlertOpen ? "Emergency Alert Sent" : "Doctor Acknowledged"}
        </h1>
        
        <div style={{ fontSize: "1.125rem", color: "var(--text-primary, #122820)", marginBottom: "2rem", lineHeight: 1.6 }}>
          {isAlertOpen ? (
            <p style={{ margin: 0 }}>Your doctor has been notified via email and dashboard alert. Waiting for acknowledgment...</p>
          ) : (
            <p style={{ margin: 0 }}>Dr. Pandey has seen your alert and is responding. Please keep your phone nearby.</p>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <a href="tel:911" className="btn" style={{ padding: "0.875rem 1.5rem", fontSize: "1.0625rem", borderRadius: "10px", background: "var(--surface-cream, #fffdf5)", border: "2px solid var(--accent-terracotta, #e05a38)", color: "var(--accent-terracotta, #e05a38)", fontWeight: 700, textDecoration: "none" }}>
            Call 911 If Situation Worsens
          </a>
        </div>
        
        <Link href="/dashboard/patient" style={{ color: "var(--text-muted, #5e746d)", fontSize: "0.9375rem", textDecoration: "underline", fontWeight: 600 }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
