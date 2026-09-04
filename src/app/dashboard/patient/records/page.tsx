import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { FileTextIcon } from "@/components/ui/Icons";

export default async function RecordsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "patient") redirect("/?auth=login");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header>
        <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Health Records
        </h1>
        <p className="text-muted">
          Access your lab results, summaries, and history.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "360px" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--surface-subtle)", border: "2px solid var(--border-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)", marginBottom: "1rem" }}>
          <FileTextIcon style={{ width: 32, height: 32 }} />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Records Module Coming Soon</h2>
        <p className="text-muted" style={{ maxWidth: "400px", fontSize: "0.9375rem" }}>Securely view and download all your past medical records and lab test results.</p>
      </div>
    </div>
  );
}
