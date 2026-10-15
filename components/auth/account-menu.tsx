"use client";

import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { staffRoutes } from "@/lib/staff/routes";
import { initials } from "@/lib/text";

type SessionKind = "staff" | "admin";

const logoutRequests: Record<SessionKind, () => ReturnType<typeof callApi>> = {
  staff: () => callApi(api.POST("/auth/staff/logout")),
  admin: () => callApi(api.POST("/auth/admin/logout")),
};

const loginRoutes: Record<SessionKind, string> = {
  staff: staffRoutes.login,
  admin: adminRoutes.login,
};

type AccountMenuProps = {
  kind: SessionKind;
  name: string;
  email: string;
  detail?: string;
  children?: React.ReactNode;
};

export function AccountMenu({ kind, name, email, detail, children }: AccountMenuProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string>();

  async function logout(event: Event) {
    event.preventDefault();
    setLoggingOut(true);
    setError(undefined);
    const result = await logoutRequests[kind]();
    if (!result.ok) {
      setError(result.message);
      setLoggingOut(false);
      return;
    }
    // Recarga completa: borra el estado que Next conserva de las páginas ya visitadas.
    window.location.assign(loginRoutes[kind]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Tu cuenta"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {initials(name)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
          <span className="truncate font-medium text-foreground">{name}</span>
          <span className="truncate text-xs text-muted-foreground">{email}</span>
          {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
        <DropdownMenuItem className="h-11" disabled={loggingOut} onSelect={logout}>
          {loggingOut ? <Spinner /> : <LogOutIcon />}
          Cerrar sesión
        </DropdownMenuItem>
        {error && <p className="px-2 py-1.5 text-sm text-destructive">{error}</p>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
