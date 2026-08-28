"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";
import type { AuthFormState } from "@/types";

const onboardingSchema = z.object({
  phone: z.string().min(5, "Enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(5, "Enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

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

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Database connection not initialized" };
  }

  try {
    const { user } = await requireAuth();

    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        phone: parsed.data.phone,
        address: parsed.data.address,
      })
      .eq("id", user.id);

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
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Database connection not initialized" };
  }

  try {
    const { user } = await requireAuth();

    // Update profile table
    const { error: profileError } = await (supabase as any)
      .from("profiles")
      .update({
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        address: parsed.data.address,
      })
      .eq("id", user.id);

    if (profileError) {
      return { error: profileError.message };
    }

    // Also update auth.users metadata if needed (for custom claims / name consistency)
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    });

    if (authError) {
      console.warn("Auth user metadata sync warning:", authError.message);
    }
  } catch (err: any) {
    return { error: err.message || "Failed to update profile" };
  }

  revalidatePath("/dashboard", "layout");
  return { success: "Profile updated successfully!" };
}

export async function updateAvatarAction(avatarUrl: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Database connection not initialized" };
  }

  try {
    const { user } = await requireAuth();

    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err.message || "Failed to update avatar" };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
