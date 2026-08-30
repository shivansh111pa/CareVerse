import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "CareVerse — Dr. Shivansh A. Pandey, MBBS",
  description:
    "Appointment booking and patient management for Dr. Shivansh A. Pandey, MBBS.",
};

import { CustomCursor } from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
