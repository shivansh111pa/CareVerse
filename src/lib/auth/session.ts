import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, UserRole } from "@/types";
import { DASHBOARD_ROUTES } from "@/types";
import { cache } from "react";

export const getSessionUser = cache(async () => {
  try {
    return await currentUser();
  } catch {
    return null;
  }
});

export const getProfile = cache(async (
  userId: string
): Promise<Profile | null> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;

  const email = user.emailAddresses?.[0]?.emailAddress || "";
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Patient";

  const doctorEmail = process.env.DOCTOR_EMAIL?.toLowerCase();
  const role: UserRole =
    (user.publicMetadata?.role as UserRole) ||
    (doctorEmail && email.toLowerCase() === doctorEmail ? "doctor" : "patient");

  try {
    const supabase = createAdminClient();
    
    // First try finding profile by Clerk user id
    const { data: existingById } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingById) {
      return existingById as Profile;
    }

    // Try finding doctor profile if this is the doctor
    if (role === "doctor") {
      const { data: docProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "doctor")
        .maybeSingle();

      if (docProfile) {
        return docProfile as Profile;
      }
    }

    // Construct profile
    const profile: Profile = {
      id: user.id,
      role,
      full_name: fullName,
      phone: user.phoneNumbers?.[0]?.phoneNumber || null,
      created_at: new Date().toISOString(),
    };

    // Attempt to persist in Supabase
    await (supabase.from("profiles") as any).upsert(profile, { onConflict: "id" });
    return profile;
  } catch {
    // Return fallback profile if Supabase is temporarily unreachable
    return {
      id: user.id,
      role,
      full_name: fullName,
      phone: user.phoneNumbers?.[0]?.phoneNumber || null,
      created_at: new Date().toISOString(),
    };
  }
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
  const profile = await getCurrentProfile();
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
