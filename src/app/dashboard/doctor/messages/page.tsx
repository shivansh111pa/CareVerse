import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "doctor") redirect("/?auth=login");

  const conversations = [
    { id: "C1", name: "Liam Nguyen", lastMsg: "Thank you, doctor. I&apos;ll pick up the prescription today.", time: "10:24 AM", unread: true },
    { id: "C2", name: "Isabella Rossi", lastMsg: "Is it normal to have a slight fever?", time: "Yesterday", unread: false },
    { id: "C3", name: "David Kim", lastMsg: "Sounds good, see you then.", time: "Oct 24", unread: false },
  ];

  return (
    <div className="dashboard-page" style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%", maxHeight: "calc(100vh - 4rem)" }}>
      <header id="overview" style={{ flexShrink: 0 }}>
        <h1 className="font-display dashboard-page__title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Messages & Consultations
        </h1>
        <p className="text-muted dashboard-page__lead">
          Communicate with your patients securely.
        </p>
      </header>

      {/* Two Pane Layout */}
      <div className="glass-panel" style={{ flex: 1, padding: 0, display: "flex", overflow: "hidden", minHeight: "500px" }}>
        
        {/* Left Pane - Conversation List */}
        <div style={{ width: "320px", borderRight: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <input type="text" placeholder="Search conversations..." className="glass-input" style={{ borderRadius: "99px" }} disabled />
          </div>
          
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.map((conv) => (
              <div key={conv.id} style={{ 
                padding: "1.25rem", 
                borderBottom: "1px solid rgba(255,255,255,0.05)", 
                display: "flex", 
                gap: "1rem",
                cursor: "pointer",
                background: conv.id === "C1" ? "rgba(255,255,255,0.05)" : "transparent",
                borderLeft: conv.id === "C1" ? "3px solid var(--accent-aqua)" : "3px solid transparent"
              }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
                    {conv.name.charAt(0)}
                  </div>
                  {conv.unread && (
                    <div style={{ position: "absolute", top: 0, right: 0, width: "12px", height: "12px", background: "rgba(255, 99, 132, 1)", borderRadius: "50%", border: "2px solid var(--bg-deep)" }}></div>
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.name}</div>
                    <div style={{ fontSize: "0.75rem", color: conv.unread ? "var(--accent-aqua)" : "var(--text-muted)", fontWeight: conv.unread ? 600 : 400 }}>{conv.time}</div>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: conv.unread ? "var(--text-bright)" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: conv.unread ? 500 : 400 }}>
                    {conv.lastMsg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Message Thread */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "transparent" }}>
          
          {/* Thread Header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
                L
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "1rem" }}>Liam Nguyen</div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent-aqua)" }}>Active now</div>
              </div>
            </div>
            
            <button disabled className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)" }}>
              View Profile
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Timestamp */}
            <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", margin: "1rem 0" }}>
              Today, 9:45 AM
            </div>

            {/* Patient Message */}
            <div style={{ display: "flex", gap: "1rem", maxWidth: "80%" }}>
              <div style={{ width: "32px", height: "32px", flexShrink: 0, borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem" }}>
                L
              </div>
              <div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "0 16px 16px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                  Hi Doctor, the antibiotics seem to be working but I still have a slight cough. Should I continue taking the cough syrup?
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.25rem", marginLeft: "0.5rem" }}>9:45 AM</div>
              </div>
            </div>

            {/* Doctor Message */}
            <div style={{ display: "flex", gap: "1rem", maxWidth: "80%", alignSelf: "flex-end", flexDirection: "row-reverse" }}>
              <div style={{ width: "32px", height: "32px", flexShrink: 0, borderRadius: "50%", background: "var(--bg-deep)", color: "var(--text-bright)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem", border: "1px solid var(--accent-aqua)" }}>
                You
              </div>
              <div>
                <div style={{ background: "var(--accent-aqua)", color: "#000", padding: "1rem", borderRadius: "16px 0 16px 16px", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                  Yes, Liam. Please continue the cough syrup as needed for the next 2-3 days. If it persists beyond that, let me know.
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.25rem", marginRight: "0.5rem", textAlign: "right" }}>10:15 AM • Read</div>
              </div>
            </div>
            
            {/* Patient Message */}
            <div style={{ display: "flex", gap: "1rem", maxWidth: "80%" }}>
              <div style={{ width: "32px", height: "32px", flexShrink: 0, borderRadius: "50%", background: "var(--accent-aqua)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem" }}>
                L
              </div>
              <div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "0 16px 16px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                  Thank you, doctor. I&apos;ll pick up the prescription today.
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.25rem", marginLeft: "0.5rem" }}>10:24 AM</div>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div style={{ padding: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
              <button disabled className="btn btn-ghost" style={{ padding: "0.75rem", borderRadius: "50%", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              
              <textarea 
                className="glass-input" 
                placeholder="Type your message..." 
                rows={1}
                disabled
                style={{ flex: 1, borderRadius: "24px", resize: "none", padding: "0.875rem 1.25rem", minHeight: "48px" }}
              />
              
              <button disabled className="btn" style={{ padding: "0.75rem 1.5rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", flexShrink: 0 }}>
                Send
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
