/**
 * Seed the doctor's Supabase Auth user + profile from environment variables.
 *
 * Usage: npm run seed:doctor
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DOCTOR_EMAIL
 *   DOCTOR_PASSWORD
 *   DOCTOR_FULL_NAME
 *   DOCTOR_PHONE (optional)
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types";

interface AuthUser {
  id: string;
  email?: string;
}

const MAX_ATTEMPTS = 5;

function fail(message: string): never {
  console.error(message);
  throw new Error(message);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  input: string,
  init: RequestInit,
  label: string
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(input, init);
      if (response.ok || response.status < 500) {
        return response;
      }

      lastError = new Error(`${label} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      const delayMs = attempt * 1000;
      console.warn(`${label} failed (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying in ${delayMs}ms…`);
      await sleep(delayMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function adminFetch(
  supabaseUrl: string,
  serviceKey: string,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("apikey", serviceKey);
  headers.set("Authorization", `Bearer ${serviceKey}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetchWithRetry(`${supabaseUrl}${path}`, { ...init, headers }, path);
}

async function findUserByEmail(
  supabaseUrl: string,
  serviceKey: string,
  email: string
): Promise<AuthUser | null> {
  const normalized = email.trim().toLowerCase();
  let page = 1;
  const perPage = 1000;

  while (true) {
    const response = await adminFetch(
      supabaseUrl,
      serviceKey,
      `/auth/v1/admin/users?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      const body = await response.text();
      fail(`Failed to list auth users (${response.status}): ${body.slice(0, 200)}`);
    }

    const payload = (await response.json()) as { users?: AuthUser[] };
    const match = payload.users?.find(
      (user) => user.email?.trim().toLowerCase() === normalized
    );
    if (match) return match;

    if (!payload.users || payload.users.length < perPage) break;
    page += 1;
  }

  return null;
}

async function createAuthUser(
  supabaseUrl: string,
  serviceKey: string,
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<AuthUser> {
  const response = await adminFetch(supabaseUrl, serviceKey, "/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: phone ?? null,
      },
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(body.slice(0, 300));
  }

  const payload = JSON.parse(body) as AuthUser;
  if (!payload.id) {
    fail("Failed to create doctor user: no user returned.");
  }

  return payload;
}

async function updateAuthUser(
  supabaseUrl: string,
  serviceKey: string,
  userId: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<void> {
  const response = await adminFetch(
    supabaseUrl,
    serviceKey,
    `/auth/v1/admin/users/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          phone: phone ?? null,
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    fail(`Failed to update doctor user (${response.status}): ${body.slice(0, 200)}`);
  }
}

function printSqlFallback(email: string, fullName: string, phone?: string) {
  const safeName = fullName.replace(/'/g, "''");
  const safePhone = phone ? `'${phone.replace(/'/g, "''")}'` : "null";

  console.error(`
Network calls to Supabase Auth failed. You can finish setup manually in Supabase → SQL Editor:

insert into public.profiles (id, role, full_name, phone)
select id, 'doctor'::public.user_role, '${safeName}', ${safePhone}
from auth.users
where email = '${email}'
on conflict (id) do update
  set role = excluded.role,
      full_name = excluded.full_name,
      phone = excluded.phone;
`);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const email = process.env.DOCTOR_EMAIL?.trim();
  const password = process.env.DOCTOR_PASSWORD;
  const fullName = process.env.DOCTOR_FULL_NAME;
  const phone = process.env.DOCTOR_PHONE?.trim();

  const missing = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !serviceKey && "SUPABASE_SERVICE_ROLE_KEY",
    !email && "DOCTOR_EMAIL",
    !password && "DOCTOR_PASSWORD",
    !fullName && "DOCTOR_FULL_NAME",
  ].filter(Boolean);

  if (missing.length) {
    fail(`Missing env vars: ${missing.join(", ")}`);
  }

  let userId: string | undefined;

  try {
    let existing = await findUserByEmail(url!, serviceKey!, email!);

    if (existing) {
      userId = existing.id;
      console.log(`Doctor auth user already exists (${email}), syncing password and profile…`);
      await updateAuthUser(url!, serviceKey!, userId, password!, fullName!, phone);
    } else {
      try {
        const created = await createAuthUser(
          url!,
          serviceKey!,
          email!,
          password!,
          fullName!,
          phone
        );
        userId = created.id;
        console.log(`Created doctor auth user: ${email}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.toLowerCase().includes("already been registered")) {
          throw error;
        }

        existing = await findUserByEmail(url!, serviceKey!, email!);
        if (!existing) {
          fail(
            `Doctor email ${email} is registered but could not be loaded. Check your network or Supabase Auth dashboard.`
          );
        }

        userId = existing.id;
        console.log(`Doctor auth user already exists (${email}), syncing password and profile…`);
        await updateAuthUser(url!, serviceKey!, userId, password!, fullName!, phone);
      }
    }
  } catch (error) {
    printSqlFallback(email!, fullName!, phone);
    throw error;
  }

  const supabase = createClient<Database>(url!, serviceKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId!,
      role: "doctor",
      full_name: fullName!,
      phone: phone ?? null,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    printSqlFallback(email!, fullName!, phone);
    fail(`Failed to upsert doctor profile: ${profileError.message}`);
  }

  console.log("Doctor profile seeded with role=doctor.");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
