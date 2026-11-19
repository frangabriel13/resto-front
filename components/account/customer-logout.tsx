"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "./use-logout";

export function CustomerLogout({ customerName }: { customerName: string }) {
  const { pending, logout } = useLogout();

  return (
    <div className="flex flex-col items-center gap-1 text-center text-sm">
      <p>
        Estás como <span className="font-medium text-foreground">{customerName}</span>
      </p>
      <Button variant="link" className="h-auto min-h-11 font-medium text-ink" disabled={pending} onClick={logout}>
        ¿No sos vos? Cerrar sesión
      </Button>
    </div>
  );
}
