import type { Profile } from "@/types";
import { getNavForRole } from "@/lib/dashboard/nav";
import { logoutAction } from "@/app/actions/auth";
import { DashboardNavLink } from "@/components/dashboard/DashboardNavLink";
import Link from "next/link";

interface DashboardSidebarProps {
  profile: Profile;
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const navItems = getNavForRole(profile.role);
  const roleLabel = profile.role === "doctor" ? "Doctor" : "Patient";
  const settingsHref = profile.role === "doctor" ? "/dashboard/doctor/settings" : "/dashboard/patient/settings";
  const initials = getInitials(profile.full_name);

  return (
    <aside className="dashboard-sidebar glass-panel glass-panel--calm">
      <div className="dashboard-sidebar__brand">
        <span className="font-display dashboard-sidebar__logo">CareVerse</span>
        <span className="font-mono dashboard-sidebar__role">{roleLabel}</span>
      </div>

      <Link href={settingsHref} className="dashboard-sidebar__user" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--accent-aqua)" }}
          />
        ) : (
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(110, 231, 222, 0.15)",
            border: "1.5px solid rgba(110, 231, 222, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--accent-aqua)"
          }}>
            {initials}
          </div>
        )}
        <div>
          <p className="dashboard-sidebar__name" style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>
            {profile.full_name || "User"}
          </p>
          <p className="font-mono text-muted dashboard-sidebar__meta" style={{ margin: 0, fontSize: "0.75rem" }}>
            {roleLabel} portal
          </p>
        </div>
      </Link>

      <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <DashboardNavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="dashboard-sidebar__footer">
        <form action={logoutAction}>
          <button type="submit" className="btn btn-ghost dashboard-sidebar__logout">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
