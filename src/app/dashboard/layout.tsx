import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { LiquidSurface } from "@/components/layout/LiquidSurface";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");

  const needsOnboarding = !profile.phone || !profile.address;

  if (needsOnboarding) {
    return (
      <>
        <LiquidSurface calm />
        <OnboardingForm />
      </>
    );
  }

  return (
    <>
      <LiquidSurface calm />
      <div className="dashboard-shell page-shell">
        <DashboardSidebar profile={profile} />
        <main className="dashboard-main">{children}</main>
      </div>
    </>
  );
}
