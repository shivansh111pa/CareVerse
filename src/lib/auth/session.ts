import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";
import { DASHBOARD_ROUTES } from "@/types";
import { cache } from "react";

export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (
  userId: string,
  client?: any
): Promise<Profile | null> => {
  const supabase = client ?? (await createClient());
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  return getProfile(user.id);
});

export function getDashboardPath(role: UserRole): string {
  return DASHBOARD_ROUTES[role];
}

export async function requireAuth(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
  profile: Profile;
}> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const profile = await getProfile(user.id);
  if (!profile) {
    throw new Error("Profile not found");
  }
  return { user, profile };
}

export async function requireRole(role: UserRole) {
  const { user, profile } = await requireAuth();
  if (profile.role !== role) {
    throw new Error("Forbidden");
  }
  return { user, profile };
}
