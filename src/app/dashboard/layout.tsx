import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { LiquidSurface } from "@/components/layout/LiquidSurface";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");

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
