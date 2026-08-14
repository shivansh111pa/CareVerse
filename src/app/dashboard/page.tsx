import { redirect } from "next/navigation";
import { getCurrentProfile, getDashboardPath } from "@/lib/auth/session";

export default async function DashboardIndexPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?auth=login");
  redirect(getDashboardPath(profile.role));
}
