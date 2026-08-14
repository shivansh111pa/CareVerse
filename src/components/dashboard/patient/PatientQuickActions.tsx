import Link from "next/link";
import { PATIENT_QUICK_ACTIONS } from "@/lib/dashboard/nav";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function PatientQuickActions() {
  return (
    <section className="dashboard-quick-actions" aria-label="Quick actions">
      <h2 className="font-display dashboard-quick-actions__title">Quick actions</h2>
      <div className="dashboard-quick-actions__grid">
        {PATIENT_QUICK_ACTIONS.map((action) => (
          <Link key={action.href} href={action.href} className="dashboard-quick-action-link">
            <GlassPanel variant="calm" className="dashboard-quick-action">
              <span className="dashboard-quick-action__label">{action.label}</span>
              <span className="text-muted dashboard-quick-action__desc">
                {action.description}
              </span>
              <span className="font-mono dashboard-quick-action__badge">Coming soon</span>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </section>
  );
}
