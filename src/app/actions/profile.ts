"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";
import type { AuthFormState } from "@/types";

const onboardingSchema = z.object({
  phone: z
    .string({ required_error: "Mobile number is required" })
    .trim()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters"),
});

const profileSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters"),
  phone: z
    .string({ required_error: "Mobile number is required" })
    .trim()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters"),
  age: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z
      .number({ invalid_type_error: "Age must be a valid number" })
      .min(1, "Age must be at least 1")
      .max(100, "Age cannot exceed 100")
      .optional()
  ),
  height: z.string().optional().transform((v) => (v?.trim() ? v.trim() : undefined)),
  weight: z.string().optional().transform((v) => (v?.trim() ? v.trim() : undefined)),
});

async function getSupabaseDb() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export async function onboardUserAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = onboardingSchema.safeParse({
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await getSupabaseDb();
  if (!supabase) {
    return { error: "Database connection not initialized" };
  }

  try {
    const { user } = await requireAuth();

    const { error } = await (supabase as any)
      .from("profiles")
      .upsert(
        {
          id: user.id,
          phone: parsed.data.phone,
          address: parsed.data.address,
        },
        { onConflict: "id" }
      );

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err.message || "Failed to update profile" };
  }

  revalidatePath("/dashboard", "layout");
  return { success: "Profile onboarding complete!" };
}

export async function updateProfileAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    age: formData.get("age"),
    height: formData.get("height"),
    weight: formData.get("weight"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await getSupabaseDb();
  if (!supabase) {
    return { error: "Database connection not initialized" };
  }

  try {
    const { user } = await requireAuth();

    const updatePayload: Record<string, any> = {
      id: user.id,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      address: parsed.data.address,
    };

    if (parsed.data.age !== undefined) {
      updatePayload.age = parsed.data.age;
    }
    if (parsed.data.height !== undefined) {
      updatePayload.height = parsed.data.height;
    }
    if (parsed.data.weight !== undefined) {
      updatePayload.weight = parsed.data.weight;
    }

    // Update or insert profile record
    const { error: profileError } = await (supabase as any)
      .from("profiles")
      .upsert(updatePayload, { onConflict: "id" });

    if (profileError) {
      return { error: profileError.message };
    }

    // Attempt Supabase auth metadata sync if available
    if ("auth" in supabase && (supabase as any).auth?.updateUser) {
      try {
        await (supabase as any).auth.updateUser({
          data: {
            full_name: parsed.data.fullName,
            phone: parsed.data.phone,
          },
        });
      } catch {
        // Ignore auth sync warning when session is managed by Clerk
      }
    }
  } catch (err: any) {
    return { error: err.message || "Failed to update profile" };
  }

  revalidatePath("/dashboard", "layout");
  return { success: "Profile updated successfully!" };
}

export async function updateAvatarAction(avatarUrl: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await getSupabaseDb();
  if (!supabase) {
    return { error: "Database connection not initialized" };
  }

  try {
    const { user } = await requireAuth();

    const { error } = await (supabase as any)
      .from("profiles")
      .upsert(
        {
          id: user.id,
          avatar_url: avatarUrl,
        },
        { onConflict: "id" }
      );

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err.message || "Failed to update avatar" };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
