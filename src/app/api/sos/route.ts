import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { patientId } = await req.json();

    if (session.user.id !== patientId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Insert emergency row
    const { data: emergency, error: dbError } = await supabase
      .from("emergencies" as any)
      // @ts-ignore
      .insert({ patient_id: patientId, status: "open" })
      .select()
      .single();

    if (dbError) {
      console.error("Failed to insert emergency:", dbError);
      return NextResponse.json({ error: "Failed to trigger SOS" }, { status: 500 });
    }

    // 2. Fetch patient details for email
    const { data: profileRaw } = await supabase
      .from("profiles" as any)
      .select("full_name, phone")
      .eq("id", patientId)
      .single();

    const profile = profileRaw as any;

    const patientName = profile?.full_name || "A patient";
    const patientPhone = profile?.phone || "No phone provided";

    // 3. Send email to Doctor
    const doctorEmail = process.env.DOCTOR_EMAIL;
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;
    
    if (doctorEmail && smtpEmail && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: smtpEmail,
            pass: smtpPass
          },
        });

        await transporter.sendMail({
          from: `"CareVerse SOS" <${smtpEmail}>`,
          to: doctorEmail,
          subject: `🚨 SOS EMERGENCY: ${patientName}`,
          text: `Emergency triggered by ${patientName}.\nContact Number: ${patientPhone}\nPlease log into the CareVerse dashboard immediately to review.`,
          html: `<h2>🚨 MEDICAL EMERGENCY TRIGGERED</h2>
                 <p><strong>Patient:</strong> ${patientName}</p>
                 <p><strong>Phone:</strong> ${patientPhone}</p>
                 <br/>
                 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/doctor" style="padding: 10px 20px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 5px;">View Dashboard</a>`
        });

        console.log("SOS Email sent successfully.");
      } catch (emailError) {
        console.error("Failed to send SOS email:", emailError);
      }
    } else {
      console.warn("Skipping SOS Email: SMTP credentials not provided in .env.local");
    }

    return NextResponse.json({ success: true, emergencyId: (emergency as any).id });

  } catch (error: any) {
    console.error("SOS API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
