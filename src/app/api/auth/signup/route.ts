import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Server authentication misconfigured" }, { status: 500 });
    }

    const names = (fullName || "").trim().split(/\s+/);
    const firstName = names[0] || "Patient";
    const lastName = names.slice(1).join(" ") || "";

    const res = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [email],
        password,
        first_name: firstName,
        last_name: lastName,
        skip_password_checks: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.errors?.[0]?.long_message || data.errors?.[0]?.message || "Failed to create account.";
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    // Pre-seed profile in Supabase so user profile is ready immediately
    try {
      const supabase = createAdminClient();
      await supabase.from("profiles").upsert({
        id: data.id,
        role: "patient",
        full_name: `${firstName} ${lastName}`.trim(),
        phone: "",
        address: "",
      });
    } catch (dbErr) {
      console.warn("Could not pre-seed profile in Supabase:", dbErr);
    }

    return NextResponse.json({ success: true, userId: data.id });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
