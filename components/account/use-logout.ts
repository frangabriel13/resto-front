"use client";

import { useState } from "react";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { customerRoutes } from "@/lib/customer/routes";

// Teléfonos compartidos: después de cerrar sesión, recarga completa en /cuenta lista para otra persona.
export function useLogout() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await callApi(api.POST("/auth/customer/logout"));
    window.location.assign(customerRoutes.account);
  }

  return { pending, logout };
}
