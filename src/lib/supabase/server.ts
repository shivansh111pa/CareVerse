import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types";

export async function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Force cookie options for local dev reliability
            const safeOptions = { ...options, secure: process.env.NODE_ENV === "production", domain: undefined };
            console.log("Setting cookie:", name, "options:", safeOptions);
            cookieStore.set(name, value, safeOptions);
          });
        } catch (err) {
          console.error("Failed to set cookie in server.ts:", err);
          // setAll called from a Server Component — middleware handles refresh
        }
      },
    },
  });
}
