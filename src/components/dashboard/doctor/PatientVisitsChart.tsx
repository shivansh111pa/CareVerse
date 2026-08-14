export function PatientVisitsChart() {
  return (
    <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Patient Visits (Oct 2024)</h3>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "var(--text-muted)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-aqua)" }}></span>
            Patient Visits
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ width: "12px", height: "2px", background: "var(--accent-violet)" }}></span>
            average line
          </div>
        </div>
      </div>
      
      {/* Chart Placeholder Area */}
      <div style={{ flex: 1, position: "relative", minHeight: "240px", borderBottom: "1px solid rgba(255,255,255,0.1)", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "1rem 0 0 1rem" }}>
        {/* Y Axis labels placeholder */}
        <div style={{ position: "absolute", left: "-20px", top: "0", bottom: "0", display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        
        {/* Mock Chart SVG (Static line/area representation) */}
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <path d="M0,180 C20,120 40,160 60,80 C80,180 100,160 120,40 C140,140 160,130 180,100 C200,80 220,130 240,60 C260,110 280,130 300,60 C320,120 340,90 360,20 C380,10 400,20 400,20 L400,200 L0,200 Z" fill="rgba(110, 231, 222, 0.15)" stroke="var(--accent-aqua)" strokeWidth="3" />
          <line x1="0" y1="160" x2="400" y2="60" stroke="var(--accent-violet)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* X Axis labels placeholder */}
        <div style={{ position: "absolute", left: "0", right: "0", bottom: "-20px", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>Oct 1</span>
          <span>7</span>
          <span>14</span>
          <span>21</span>
          <span>28</span>
          <span>31</span>
        </div>
      </div>
    </div>
  );
}
