import type { MerchantStatus } from "@/lib/merchants/status";
import { adminRoutes } from "./routes";

// El filtro del listado viaja en la URL en español (`/admin?estado=activo`).
export const statusFilters = [
  { param: "preparacion", status: "DRAFT", label: "En preparación" },
  { param: "activo", status: "ACTIVE", label: "Activos" },
  { param: "pausado", status: "PAUSED", label: "Pausados" },
  { param: "finalizado", status: "ENDED", label: "Finalizados" },
] as const satisfies { param: string; status: MerchantStatus; label: string }[];

// Un valor desconocido muestra todos.
export function parseStatusFilter(value: string | string[] | undefined): MerchantStatus | null {
  return statusFilters.find((filter) => filter.param === value)?.status ?? null;
}

export function statusFilterHref(status: MerchantStatus | null): string {
  const filter = statusFilters.find((item) => item.status === status);
  return filter ? `${adminRoutes.merchants}?estado=${filter.param}` : adminRoutes.merchants;
}
