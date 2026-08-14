const PLACEHOLDER_PATTERNS = [
  "your-project",
  "your-anon-key",
  "your-service-role-key",
  "paste_here",
  "xxxxxxxx",
];

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
}

const SETUP_INSTRUCTIONS = `Supabase is not configured.

Local dev: add vars to .env.local, then restart npm run dev.

Vercel deploy: Project → Settings → Environment Variables → add all vars below → Redeploy.

Required:
  NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
  NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app`;

export function getSupabaseConfigMessage(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const missing: string[] = [];

  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");

  if (missing.length > 0) {
    return `Missing: ${missing.join(", ")}. On Vercel, set these under Settings → Environment Variables, then redeploy.\n\n${SETUP_INSTRUCTIONS}`;
  }

  if (isPlaceholder(url) || isPlaceholder(anonKey)) {
    return `Supabase keys still look like placeholders. Replace with real values from Supabase → Settings → API Keys.\n\n${SETUP_INSTRUCTIONS}`;
  }

  if (url!.includes("/rest/v1")) {
    return `NEXT_PUBLIC_SUPABASE_URL must be https://YOUR-REF.supabase.co — remove /rest/v1/ from the URL.`;
  }

  if (!url!.startsWith("https://") || !url!.includes(".supabase.co")) {
    return `NEXT_PUBLIC_SUPABASE_URL looks invalid: ${url}`;
  }

  return SETUP_INSTRUCTIONS;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url || !anonKey || !siteUrl) return false;
  if (isPlaceholder(url) || isPlaceholder(anonKey)) return false;
  if (!url.startsWith("https://") || !url.includes(".supabase.co")) return false;
  if (url.includes("/rest/v1")) return false;

  return true;
}

export function getSupabaseEnv(): {
  url: string;
  anonKey: string;
  siteUrl: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}.\n\n${SETUP_INSTRUCTIONS}`
    );
  }

  if (url!.includes("/rest/v1")) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must be the project root (e.g. https://your-ref.supabase.co), not the REST endpoint. Remove /rest/v1/ from the URL.\n\n${SETUP_INSTRUCTIONS}`
    );
  }

  if (!url!.startsWith("https://") || !url!.includes(".supabase.co")) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL looks invalid: ${url}\n\n${SETUP_INSTRUCTIONS}`
    );
  }

  if (isPlaceholder(url!) || isPlaceholder(anonKey!)) {
    throw new Error(
      `Supabase env vars still contain placeholder values.\n\n${SETUP_INSTRUCTIONS}`
    );
  }

  return { url: url!, anonKey: anonKey!, siteUrl: siteUrl! };
}

/** Public site origin for auth email links — prefers configured URL, then Vercel host. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (configured && !configured.includes("localhost")) {
    return configured;
  }

  const vercelHost = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  if (configured) {
    return configured;
  }

  return "http://localhost:3000";
}
