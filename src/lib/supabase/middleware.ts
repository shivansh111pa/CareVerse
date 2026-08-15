import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const env = getSupabaseEnv();
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const safeOptions = { ...options, secure: process.env.NODE_ENV === "production", domain: undefined };
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          const safeOptions = { ...options, secure: process.env.NODE_ENV === "production", domain: undefined };
          supabaseResponse.cookies.set(name, value, safeOptions);
        });
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Bad URL, network, or invalid keys — allow page to load
    return supabaseResponse;
  }

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/auth/") ||
    pathname === "/auth/callback" ||
    pathname === "/auth/reset-password";

  const isProtected = pathname.startsWith("/dashboard");
  const isDoctorRoute = pathname.startsWith("/dashboard/doctor");
  const isPatientRoute = pathname.startsWith("/dashboard/patient");
  const isLanding = pathname === "/";

  // Resolve role from JWT token instantly (Custom Claims)
  let role: "patient" | "doctor" | null = null;
  if (user) {
    role = user.app_metadata?.role as "patient" | "doctor" | undefined ?? null;
  }

  // Signed-in user on landing → dashboard
  if (isLanding && user && role) {
    const dest =
      role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Unauthenticated on protected routes → landing
  if (isProtected && !user) {
    const url = new URL("/", request.url);
    url.searchParams.set("auth", "login");
    return NextResponse.redirect(url);
  }

  // Role-based route guards
  if (user && role) {
    if (isDoctorRoute && role !== "doctor") {
      return NextResponse.redirect(
        new URL("/dashboard/patient", request.url)
      );
    }
    if (isPatientRoute && role === "doctor") {
      return NextResponse.redirect(
        new URL("/dashboard/doctor", request.url)
      );
    }
  }

  // Allow auth callback/reset routes through
  if (isAuthRoute) {
    return supabaseResponse;
  }

  return supabaseResponse;
}
