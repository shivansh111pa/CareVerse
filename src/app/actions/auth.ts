"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath, getProfile } from "@/lib/auth/session";
import { getSupabaseConfigMessage, getSiteUrl } from "@/lib/env";
import type { AuthFormState } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
});

const resetSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: getSupabaseConfigMessage() };
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in failed. Please try again." };
  }

  // Use admin client to fetch profile because the Next.js Server Action
  // cookie store doesn't immediately reflect the newly set auth cookie 
  // in subsequent SSR client requests, causing RLS to block the read.
  const adminSupabase = (await import("@supabase/supabase-js")).createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile, error: pError } = await adminSupabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log("Admin profile fetch:", { profile, pError });

  if (!profile) {
    console.log("Profile is missing!");
    return {
      error:
        "Account found but profile is missing. Run the database migration or contact the clinic.",
    };
  }
  
  console.log("Returning redirect URL", getDashboardPath(profile.role));
  return { redirectUrl: getDashboardPath(profile.role) };
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: getSupabaseConfigMessage() };
  }
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone ?? null,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Account created. Check your email to verify your address, then sign in.",
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: getSupabaseConfigMessage() };
  }
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/auth/reset-password`,
    }
  );

  if (error) {
    return { error: error.message };
  }

  return {
    success: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = formData.get("password");
  const confirm = formData.get("confirmPassword");

  if (typeof password !== "string" || password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: getSupabaseConfigMessage() };
  }
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/?auth=login");
}

export async function googleSignInAction(): Promise<AuthFormState> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: getSupabaseConfigMessage() };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Could not initialize Google sign-in" };
}
