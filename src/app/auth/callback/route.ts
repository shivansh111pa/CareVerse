import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/?auth=login&error=supabase_not_configured`);
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
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
  }

  return NextResponse.redirect(`${origin}/?auth=login&error=auth_callback_failed`);
}
