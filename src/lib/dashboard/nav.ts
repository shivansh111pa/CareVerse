import type { UserRole } from "@/types";

export interface DashboardNavItem {
  label: string;
  href: string;
  /** Same-page anchor for smooth scroll */
  anchor?: boolean;
}

export const DOCTOR_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/doctor", anchor: true },
  { label: "Today's schedule", href: "/dashboard/doctor#appointments", anchor: true },
  { label: "Patients", href: "/dashboard/doctor/patients" },
  { label: "Prescriptions", href: "/dashboard/doctor/prescriptions" },
  { label: "Reports", href: "/dashboard/doctor/reports" },
];

export const PATIENT_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/patient", anchor: true },
  { label: "Appointments", href: "/dashboard/patient/appointments" },
  { label: "Prescriptions", href: "/dashboard/patient/prescriptions" },
  { label: "Health history", href: "/dashboard/patient/history" },
];

export function getNavForRole(role: UserRole): DashboardNavItem[] {
  return role === "doctor" ? DOCTOR_NAV : PATIENT_NAV;
}

export const PATIENT_QUICK_ACTIONS = [
  {
    label: "Book appointment",
    description: "Schedule your next visit",
    href: "/dashboard/patient/appointments/book",
  },
  {
    label: "Check symptoms",
    description: "Log how you're feeling",
    href: "/dashboard/patient/symptoms",
  },
  {
    label: "View history",
    description: "Past visits and records",
    href: "/dashboard/patient/history",
  },
] as const;
