import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types";

export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
