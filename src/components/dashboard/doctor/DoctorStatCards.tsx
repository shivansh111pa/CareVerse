import { DashboardStatCard } from "@/components/dashboard/shared/DashboardStatCard";

/** Swap in real SOS query when the alerts module ships. */
export function PendingSosCard() {
  return (
    <DashboardStatCard
      label="Pending SOS"
      value="—"
      hint="Emergency alerts module coming soon"
      accent="coral"
    />
  );
}

/** Swap in real prescription count when the Rx module ships. */
export function PrescriptionsWeekCard() {
  return (
    <DashboardStatCard
      label="Prescriptions this week"
      value="—"
      hint="Weekly Rx totals will appear here"
      accent="violet"
    />
  );
}

/** Swap in real patient count when the patients module ships. */
export function TotalPatientsCard() {
  return (
    <DashboardStatCard
      label="Total patients"
      value="—"
      hint="Patient registry module coming soon"
      accent="aqua"
    />
  );
}

export function DoctorStatCards() {
  return (
    <div className="dashboard-stat-grid">
      <PendingSosCard />
      <PrescriptionsWeekCard />
      <TotalPatientsCard />
    </div>
  );
}
