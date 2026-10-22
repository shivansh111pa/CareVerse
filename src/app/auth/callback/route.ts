import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/?auth=login&error=supabase_not_configured`);
  }

  let authSuccess = false;

  // 1. PKCE flow code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      authSuccess = true;
    }
  } else if (token_hash && type) {
    // 2. Token hash verification (email recovery, magic link, confirmation)
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    if (!error) {
      authSuccess = true;
    }
  }

  if (authSuccess) {
    // If this is password recovery or next explicitly points to reset-password, honor it immediately!
    if (type === "recovery" || next.startsWith("/auth/reset-password")) {
      return NextResponse.redirect(`${origin}/auth/reset-password`);
    }

    // If custom non-root destination was requested, redirect there
    if (next && next !== "/" && !next.startsWith("/?")) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Default flow: redirect based on user role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const adminSupabase = (await import("@supabase/supabase-js")).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: profile } = await adminSupabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        const dest = profile.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";
        return NextResponse.redirect(`${origin}${dest}`);
      }
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/?auth=login&error=auth_callback_failed`);
}
