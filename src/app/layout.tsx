import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareVerse — Dr. Shivansh A. Pandey, MBBS",
  description:
    "Appointment booking and patient management for Dr. Shivansh A. Pandey, MBBS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
