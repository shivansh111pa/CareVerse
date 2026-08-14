import type { UserRole } from "@/types";

export interface DashboardNavItem {
  label: string;
  href: string;
  /** Same-page anchor for smooth scroll */
  anchor?: boolean;
}

export const DOCTOR_NAV: DashboardNavItem[] = [
  { label: "Home", href: "/dashboard/doctor", anchor: true },
  { label: "Patients", href: "/dashboard/doctor/patients" },
  { label: "Appointments", href: "/dashboard/doctor/appointments" },
  { label: "Analytics", href: "/dashboard/doctor/analytics" },
  { label: "Messages", href: "/dashboard/doctor/messages" },
  { label: "Settings", href: "/dashboard/doctor/settings" },
];

export const PATIENT_NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard/patient", anchor: true },
  { label: "Appointments", href: "/dashboard/patient/appointments" },
  { label: "Health Records", href: "/dashboard/patient/records" },
  { label: "Prescriptions", href: "/dashboard/patient/prescriptions" },
  { label: "Messages", href: "/dashboard/patient/messages" },
  { label: "Settings", href: "/dashboard/patient/settings" },
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
