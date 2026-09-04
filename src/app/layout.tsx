import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0b5a42",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CareVerse Clinic — Dr. Shivansh A. Pandey, MBBS | Clinical & Telehealth Practice",
  description:
    "Official clinical care, appointment scheduling, digital prescriptions, and patient records for Dr. Shivansh A. Pandey, MBBS.",
  keywords: [
    "Dr Shivansh A Pandey",
    "MBBS",
    "Clinic",
    "Doctor Appointment",
    "General Physician",
    "Telehealth",
    "Medical Records",
    "Prescriptions",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/sf-pro-display"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
