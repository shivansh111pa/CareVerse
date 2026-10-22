/**
 * Seed Doctor Account for CareVerse (Clerk + Supabase)
 *
 * Usage: npm run seed:doctor
 */

import { createClient } from "@supabase/supabase-js";

async function main() {
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const doctorEmail = (process.env.DOCTOR_EMAIL || "shivdocu21@gmail.com").trim().toLowerCase();
  const doctorPassword = process.env.DOCTOR_PASSWORD || "SHIVANSH07AS123";
  const doctorFullName = process.env.DOCTOR_FULL_NAME || "Dr. Shivansh A. Pandey";
  const doctorPhone = process.env.DOCTOR_PHONE || "9876543210";

  console.log(`\n🏥 Seeding Doctor Account for CareVerse:`);
  console.log(`   Email: ${doctorEmail}`);
  console.log(`   Name:  ${doctorFullName}\n`);

  let clerkUserId: string | null = null;

  // 1. Seed or sync into Clerk if CLERK_SECRET_KEY is configured
  if (clerkSecret) {
    console.log("Checking Clerk Authentication database...");
    try {
      const searchRes = await fetch(
        `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(doctorEmail)}`,
        {
          headers: { Authorization: `Bearer ${clerkSecret}` },
        }
      );

      const existingUsers: any = await searchRes.json();
      const existing = Array.isArray(existingUsers) ? existingUsers[0] : null;

      const nameParts = doctorFullName.split(" ");
      const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Doctor";

      if (existing) {
        clerkUserId = existing.id;
        console.log(`✓ Doctor account already exists in Clerk (ID: ${clerkUserId}). Updating password & metadata...`);
        
        await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${clerkSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: doctorPassword,
            first_name: firstName,
            last_name: lastName,
            public_metadata: { role: "doctor" },
          }),
        });
      } else {
        console.log("Creating new Doctor account in Clerk...");
        const createRes = await fetch("https://api.clerk.com/v1/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clerkSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: [doctorEmail],
            password: doctorPassword,
            first_name: firstName,
            last_name: lastName,
            public_metadata: { role: "doctor" },
          }),
        });

        const createdUser: any = await createRes.json();
        if (!createRes.ok) {
          console.error("Clerk creation failed:", createdUser);
          throw new Error(createdUser.errors?.[0]?.message || "Failed to create user in Clerk");
        }
        clerkUserId = createdUser.id;
        console.log(`✓ Created Doctor in Clerk (ID: ${clerkUserId})`);
      }
    } catch (err: any) {
      console.warn("Clerk sync warning:", err.message);
    }
  }

  // 2. Seed or update profile in Supabase
  if (supabaseUrl && serviceKey && clerkUserId) {
    console.log("\nSyncing Doctor Profile into Supabase database...");
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: clerkUserId,
          role: "doctor",
          full_name: doctorFullName,
          phone: doctorPhone,
          address: "CareVerse Super-Speciality Clinic, Civil Lines",
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.error("Supabase profile upsert error:", error.message);
    } else {
      console.log(`✓ Doctor profile synced into Supabase profiles table (ID: ${clerkUserId})`);
    }
  }

  console.log("\n🎉 Doctor account is fully ready!");
  console.log(`👉 Login Email:    ${doctorEmail}`);
  console.log(`👉 Login Password: ${doctorPassword}\n`);
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
