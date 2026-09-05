import type { ReactNode } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { FileTextIcon } from "@/components/ui/Icons";

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function DashboardEmptyState({
  title,
  description,
  icon,
}: DashboardEmptyStateProps) {
  return (
    <div className="dashboard-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", gap: "0.5rem" }}>
      <div className="dashboard-empty__icon" aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface-subtle)", border: "1.5px solid var(--border-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)", marginBottom: "0.5rem" }}>
        {icon || <FileTextIcon style={{ width: 22, height: 22 }} />}
      </div>
      <p className="dashboard-empty__title" style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{title}</p>
      <p className="text-muted dashboard-empty__desc" style={{ fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}

interface DashboardModuleCardProps {
  title: string;
  subtitle?: string;
  id?: string;
  children: ReactNode;
}

export function DashboardModuleCard({
  title,
  subtitle,
  id,
  children,
}: DashboardModuleCardProps) {
  return (
    <section id={id} className="dashboard-module-card-wrap">
      <GlassPanel variant="calm" className="dashboard-module-card" as="div">
        <header className="dashboard-module-card__header">
          <h2 className="font-display dashboard-module-card__title">{title}</h2>
          {subtitle && (
            <p className="text-muted dashboard-module-card__subtitle">{subtitle}</p>
          )}
        </header>
        {children}
      </GlassPanel>
    </section>
  );
}
