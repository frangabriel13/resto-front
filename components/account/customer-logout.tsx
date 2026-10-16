"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { customerRoutes } from "@/lib/customer/routes";

// Teléfonos compartidos: después de cerrar sesión, recarga completa en /cuenta lista para otra persona.
export function CustomerLogout({ customerName }: { customerName: string }) {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await callApi(api.POST("/auth/customer/logout"));
    window.location.assign(customerRoutes.account);
  }

  return (
    <div className="flex flex-col items-center gap-1 text-center text-sm">
      <p>
        Estás como <span className="font-medium text-foreground">{customerName}</span>
      </p>
      <Button variant="link" className="h-auto" disabled={pending} onClick={logout}>
        ¿No sos vos? Cerrar sesión
      </Button>
    </div>
  );
}
