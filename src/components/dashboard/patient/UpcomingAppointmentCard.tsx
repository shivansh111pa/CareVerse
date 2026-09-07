import {
  DashboardEmptyState,
  DashboardModuleCard,
} from "@/components/dashboard/shared/DashboardModuleCard";
import { CalendarIcon } from "@/components/ui/Icons";

interface UpcomingAppointmentCardProps {
  patientId: string;
}

/**
 * Patient next-appointment shell. Drop in Scheduler query by patientId later.
 */
export function UpcomingAppointmentCard({ patientId }: UpcomingAppointmentCardProps) {
  void patientId;

  return (
    <DashboardModuleCard
      title="Your next appointment"
      subtitle="Booking module coming soon"
    >
      <DashboardEmptyState
        icon={<CalendarIcon style={{ width: 22, height: 22 }} />}
        title="No upcoming visit"
        description="Book an appointment to see your next scheduled time here."
      />
    </DashboardModuleCard>
  );
}
