"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SOSFloatingButton({ patientId }: { patientId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create emergency");
      }

      setShowConfirm(false);
      router.push("/dashboard/patient/sos");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. If this is a medical emergency, please call 911 immediately.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "4rem",
          height: "4rem",
          borderRadius: "50%",
          backgroundColor: "#ff6b6b", // --accent-coral
          color: "white",
          border: "none",
          boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 900,
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        title="SOS Emergency"
      >
        <svg style={{ width: "2rem", height: "2rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      {showConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="glass-panel" style={{ 
            width: "100%", maxWidth: "400px",
            padding: "2rem", textAlign: "center",
            borderTop: "4px solid #ff6b6b"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#ff6b6b", marginBottom: "1rem" }}>Confirm Emergency</h2>
            <p style={{ color: "var(--text-bright)", fontSize: "0.9375rem", marginBottom: "2rem", lineHeight: 1.5 }}>
              Are you sure you want to trigger an SOS alert? Your doctor will be notified immediately.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button 
                onClick={() => setShowConfirm(false)}
                className="btn btn-ghost"
                style={{ padding: "0.75rem 1.5rem", borderRadius: "99px", flex: 1 }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className="btn"
                style={{ padding: "0.75rem 1.5rem", borderRadius: "99px", background: "#ff6b6b", color: "white", fontWeight: 600, border: "none", flex: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Yes, Trigger SOS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
