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

function parseAndValidateHeight(val?: string | null): { valid: boolean; error?: string } {
  if (!val) return { valid: true };
  const trimmed = val.trim();
  if (!trimmed) return { valid: true };

  // Case 1: Centimeters or meters (e.g. 180 cm, 203cm, 1.8m)
  const mMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*m$/i);
  if (mMatch) {
    const cm = parseFloat(mMatch[1]) * 100;
    if (cm > 203.2) return { valid: false, error: "Height cannot exceed 6'8\" (203 cm)" };
    return { valid: true };
  }

  const cmMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:cm)?$/i);
  if (cmMatch && parseFloat(cmMatch[1]) > 30) {
    const cm = parseFloat(cmMatch[1]);
    if (cm > 203.2) return { valid: false, error: "Height cannot exceed 6'8\" (203 cm)" };
    return { valid: true };
  }

  // Case 2: Feet and inches (e.g. 6'8", 6'8'', 6'8, 6 ft 8 in, 6ft 8, 6-8)
  const feetInchesMatch = trimmed.match(/^(\d+)\s*(?:'|ft|\.|\-)?\s*(\d+)?\s*(?:"|''|in)?$/i);
  if (feetInchesMatch) {
    const feet = parseInt(feetInchesMatch[1], 10);
    const inches = feetInchesMatch[2] ? parseInt(feetInchesMatch[2], 10) : 0;
    const totalInches = feet * 12 + inches;
    const maxInches = 6 * 12 + 8; // 80 inches = 6'8"

    if (totalInches > maxInches) {
      return { valid: false, error: "Height cannot exceed 6'8\" (203 cm)" };
    }
    return { valid: true };
  }

  return { valid: true };
}

function parseAndValidateWeight(val?: string | null): { valid: boolean; error?: string } {
  if (!val) return { valid: true };
  const trimmed = val.trim();
  if (!trimmed) return { valid: true };

  // Case 1: Pounds / lbs
  const lbsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:lbs|pounds|lb)$/i);
  if (lbsMatch) {
    const lbs = parseFloat(lbsMatch[1]);
    if (lbs > 264.55) {
      return { valid: false, error: "Weight cannot exceed 120 kg (264 lbs)" };
    }
    return { valid: true };
  }

  // Case 2: kg or plain number
  const kgMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos|kilograms)?$/i);
  if (kgMatch) {
    const kg = parseFloat(kgMatch[1]);
    if (kg > 120) {
      return { valid: false, error: "Weight cannot exceed 120 kg" };
    }
    return { valid: true };
  }

  return { valid: true };
}

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
  height: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined))
    .refine((v) => parseAndValidateHeight(v).valid, {
      message: "Height cannot exceed 6'8\" (203 cm)",
    }),
  weight: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined))
    .refine((v) => parseAndValidateWeight(v).valid, {
      message: "Weight cannot exceed 120 kg",
    }),
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
