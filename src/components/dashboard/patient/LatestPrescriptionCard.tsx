import {
  DashboardEmptyState,
  DashboardModuleCard,
} from "@/components/dashboard/shared/DashboardModuleCard";
import { FileTextIcon } from "@/components/ui/Icons";

interface LatestPrescriptionCardProps {
  patientId: string;
}

/**
 * Latest prescription shell. Wire to Rx module by patientId later.
 */
export function LatestPrescriptionCard({ patientId }: LatestPrescriptionCardProps) {
  void patientId;

  return (
    <DashboardModuleCard
      title="Latest prescription"
      subtitle="Prescriptions module coming soon"
    >
      <DashboardEmptyState
        icon={<FileTextIcon style={{ width: 22, height: 22 }} />}
        title="No prescriptions yet"
        description="Your most recent prescription will show here after your first visit."
      />
    </DashboardModuleCard>
  );
}
