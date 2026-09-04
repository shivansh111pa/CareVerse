import type { Profile } from "@/types";
import { getNavForRole } from "@/lib/dashboard/nav";
import { logoutAction } from "@/app/actions/auth";
import { DashboardNavLink } from "@/components/dashboard/DashboardNavLink";

interface DashboardSidebarProps {
  profile: Profile;
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const navItems = getNavForRole(profile.role);
  const roleLabel = profile.role === "doctor" ? "Doctor" : "Patient";

  return (
    <aside className="dashboard-sidebar glass-panel glass-panel--calm">
      <div className="dashboard-sidebar__brand">
        <span className="dashboard-sidebar__logo">CareVerse</span>
        <span className="dashboard-sidebar__role">{roleLabel}</span>
      </div>

      <div className="dashboard-sidebar__user">
        <p className="dashboard-sidebar__name">{profile.full_name || "User"}</p>
        <p className="text-muted dashboard-sidebar__meta">{roleLabel} portal</p>
      </div>

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
