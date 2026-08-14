"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "@/lib/dashboard/nav";

interface DashboardNavLinkProps {
  item: DashboardNavItem;
}

export function DashboardNavLink({ item }: DashboardNavLinkProps) {
  const pathname = usePathname();
  const hash = item.href.split("#")[1];
  const basePath = item.href.split("#")[0];
  const onOverview =
    (basePath === "/dashboard/doctor" || basePath === "/dashboard/patient") &&
    pathname === basePath &&
    !hash;
  const isActive =
    onOverview ||
    (hash && pathname === basePath) ||
    (!item.anchor &&
      pathname !== "/dashboard/doctor" &&
      pathname !== "/dashboard/patient" &&
      pathname.startsWith(item.href));

  if (item.anchor && item.href.includes("#")) {
    return (
      <a href={item.href} className={`dashboard-nav-link${isActive ? " is-active" : ""}`}>
        {item.label}
      </a>
    );
  }

  if (item.anchor && !item.href.includes("#")) {
    return (
      <Link
        href={item.href}
        className={`dashboard-nav-link${pathname === item.href ? " is-active" : ""}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={`dashboard-nav-link${pathname.startsWith(item.href) ? " is-active" : ""}`}
    >
      {item.label}
    </Link>
  );
}
