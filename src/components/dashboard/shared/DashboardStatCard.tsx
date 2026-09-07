import type { ReactNode } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface DashboardStatCardProps {
  label: string;
  value: string;
  hint?: string;
  accent?: "aqua" | "violet" | "coral";
  children?: ReactNode;
}

const accentClass: Record<NonNullable<DashboardStatCardProps["accent"]>, string> = {
  aqua: "dashboard-stat-card--aqua",
  violet: "dashboard-stat-card--violet",
  coral: "dashboard-stat-card--coral",
};

export function DashboardStatCard({
  label,
  value,
  hint,
  accent = "aqua",
  children,
}: DashboardStatCardProps) {
  return (
    <GlassPanel
      variant="calm"
      className={`dashboard-stat-card ${accentClass[accent]}`}
    >
      <p className="dashboard-stat-card__label">{label}</p>
      <p className="dashboard-stat-card__value">{value}</p>
      {hint && <p className="text-muted dashboard-stat-card__hint">{hint}</p>}
      {children}
    </GlassPanel>
  );
}
