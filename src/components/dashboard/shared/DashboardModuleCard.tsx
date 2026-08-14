import type { ReactNode } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function DashboardEmptyState({
  title,
  description,
  icon = "📋",
}: DashboardEmptyStateProps) {
  return (
    <div className="dashboard-empty">
      <span className="dashboard-empty__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="dashboard-empty__title">{title}</p>
      <p className="text-muted dashboard-empty__desc">{description}</p>
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
