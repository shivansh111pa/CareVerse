import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, doctorId, date, time } = body;

    // Use ethereal email for testing
    // You can replace these with your actual SMTP credentials
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: '"CareVerse Scheduler" <noreply@careverse.com>', // sender address
      to: "patient@example.com", // list of receivers. In a real app, you'd fetch the patient's email
      subject: "Appointment Confirmed", // Subject line
      text: `Your appointment has been confirmed for ${date} at ${time}.`, // plain text body
      html: `<b>Your appointment has been confirmed for ${date} at ${time}.</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
  }
}
