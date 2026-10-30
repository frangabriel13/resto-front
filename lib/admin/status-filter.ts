import type { MerchantStatus } from "@/lib/merchants/status";
import { adminRoutes } from "./routes";

// Los archivados no salen en ningún estado: tienen su propio filtro.
export type MerchantFilter = MerchantStatus | "ARCHIVED";

// El filtro del listado viaja en la URL en español (`/admin?estado=activo`).
export const statusFilters = [
  { param: "preparacion", filter: "DRAFT", label: "En preparación" },
  { param: "activo", filter: "ACTIVE", label: "Activos" },
  { param: "pausado", filter: "PAUSED", label: "Pausados" },
  { param: "finalizado", filter: "ENDED", label: "Finalizados" },
  { param: "archivados", filter: "ARCHIVED", label: "Archivados" },
] as const satisfies { param: string; filter: MerchantFilter; label: string }[];

// Un valor desconocido muestra todos.
export function parseStatusFilter(value: string | string[] | undefined): MerchantFilter | null {
  return statusFilters.find((item) => item.param === value)?.filter ?? null;
}

export function statusFilterHref(filter: MerchantFilter | null): string {
  const item = statusFilters.find((option) => option.filter === filter);
  return item ? `${adminRoutes.merchants}?estado=${item.param}` : adminRoutes.merchants;
}

// Query de `GET /admin/merchants`: sin `archived`, la API deja afuera a los archivados.
export function merchantListQuery(
  filter: MerchantFilter | null,
): { status?: MerchantStatus; archived?: "true" } {
  if (filter === "ARCHIVED") return { archived: "true" };
  return filter ? { status: filter } : {};
}
