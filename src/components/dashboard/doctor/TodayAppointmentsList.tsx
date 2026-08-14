import {
  DashboardEmptyState,
  DashboardModuleCard,
} from "@/components/dashboard/shared/DashboardModuleCard";

interface TodayAppointmentsListProps {
  /** Reserved for Scheduler module — filter by doctor id */
  doctorId?: string;
}

/**
 * Today's appointment list shell. Replace empty state with a real query
 * from the Scheduler module without changing the dashboard page layout.
 */
export function TodayAppointmentsList({ doctorId }: TodayAppointmentsListProps) {
  void doctorId;

  return (
    <DashboardModuleCard
      id="appointments"
      title="Today's appointments"
      subtitle="Scheduler module will populate this list"
    >
      <DashboardEmptyState
        icon="🗓️"
        title="No appointments scheduled"
        description="When the scheduler module is connected, today's visits will appear here automatically."
      />
    </DashboardModuleCard>
  );
}
