"use client";

import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StaffMerchant } from "@/lib/staff/access";
import { isPanelRouteActive, panelRoutes } from "@/lib/staff/routes";
import { cn } from "@/lib/utils";
import { adminNavItems, mainNavItems } from "./nav-items";

const itemClass =
  "flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground outline-none focus-visible:text-foreground";

export function BottomNav({ role }: { role: StaffMerchant["role"] }) {
  const pathname = usePathname();
  const adminItems = adminNavItems(role);
  const adminActive = adminItems.some((item) => isPanelRouteActive(pathname, item.href));

  return (
    <nav
      aria-label="Secciones del panel"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {mainNavItems.map(({ href, label, icon: Icon }) => {
          const active = isPanelRouteActive(pathname, href);
          const isScan = href === panelRoutes.scan;
          return (
            <li key={href} className="flex flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(itemClass, active && "text-primary")}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center",
                    isScan && "rounded-full bg-brand text-brand-foreground shadow-sm",
                  )}
                >
                  <Icon className={cn("size-5", active && !isScan && "text-brand")} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
        {adminItems.length > 0 && (
          <li className="flex flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(itemClass, adminActive && "text-primary")}>
                <span className="flex size-9 items-center justify-center">
                  <EllipsisIcon className={cn("size-5", adminActive && "text-brand")} />
                </span>
                Más
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="min-w-48">
                {adminItems.map(({ href, label, icon: Icon }) => (
                  <DropdownMenuItem key={href} asChild className="h-11">
                    <Link href={href}>
                      <Icon />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
    </nav>
  );
}
