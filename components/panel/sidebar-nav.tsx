"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StaffMerchant } from "@/lib/staff/access";
import { isPanelRouteActive } from "@/lib/staff/routes";
import { cn } from "@/lib/utils";
import { adminNavItems, mainNavItems, type NavItem } from "./nav-items";

export function SidebarNav({ role }: { role: StaffMerchant["role"] }) {
  const adminItems = adminNavItems(role);

  return (
    <nav aria-label="Secciones del panel" className="flex flex-col gap-6">
      <NavList items={mainNavItems} />
      {adminItems.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Administración
          </p>
          <NavList items={adminItems} />
        </div>
      )}
    </nav>
  );
}

function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isPanelRouteActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon className={cn("size-4", active && "text-brand")} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
