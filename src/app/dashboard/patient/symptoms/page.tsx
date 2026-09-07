"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (data.urgency_level === "emergency") {
        router.push("/dashboard/patient/sos");
        return;
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "low": return "var(--accent-aqua)";
      case "medium": return "var(--accent-violet)";
      case "high": return "#ff6b6b";
      default: return "var(--text-bright)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          AI Symptom Checker
        </h1>
        <p className="text-muted">
          Describe your symptoms to receive a preliminary assessment. 
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        {error && (
          <div style={{ backgroundColor: "rgba(255, 99, 132, 0.2)", color: "#ff6384", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 500 }}>
              What are you experiencing today?
            </label>
            <textarea 
              className="glass-input" 
              style={{ width: "100%", minHeight: "120px", resize: "vertical", padding: "1rem", fontSize: "1rem" }}
              placeholder="E.g., I have had a headache for 2 days and a slight fever..."
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button 
              type="submit" 
              className="btn" 
              style={{ padding: "0.75rem 2rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none" }}
              disabled={isLoading || !symptoms.trim()}
            >
              {isLoading ? "Analyzing..." : "Check Symptoms"}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="glass-panel" style={{ padding: "2rem", borderTop: `4px solid ${getUrgencyColor(result.urgency_level)}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Triage Assessment</h2>
            <span style={{ 
              padding: "0.25rem 1rem", 
              borderRadius: "99px", 
              fontSize: "0.875rem", 
              fontWeight: 600,
              backgroundColor: `${getUrgencyColor(result.urgency_level)}22`,
              color: getUrgencyColor(result.urgency_level),
              border: `1px solid ${getUrgencyColor(result.urgency_level)}55`,
              textTransform: "uppercase"
            }}>
              {result.urgency_level} Urgency
            </span>
          </div>

          <div style={{ marginBottom: "1.5rem", fontSize: "1rem", lineHeight: 1.6 }}>
            {result.ai_response?.message}
          </div>

          {result.ai_response?.causes && result.ai_response.causes.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>
                Possible Causes (Not a Diagnosis)
              </h3>
              <ul style={{ paddingLeft: "1.5rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {result.ai_response.causes.map((cause: string, i: number) => (
                  <li key={i} style={{ fontSize: "0.9375rem" }}>{cause}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.05)", 
            padding: "1rem", 
            borderRadius: "8px", 
            borderLeft: "4px solid var(--accent-violet)",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start"
          }}>
            <svg style={{ width: "1.5rem", height: "1.5rem", color: "var(--accent-violet)", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-bright)", lineHeight: 1.5 }}>
              <strong>Important Disclaimer:</strong> This is an AI-generated preliminary triage aid and NOT a medical diagnosis. 
              Please consult Dr. Pandey or seek professional medical help for an accurate diagnosis and treatment plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
