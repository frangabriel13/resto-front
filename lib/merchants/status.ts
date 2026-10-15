import type { components } from "@/lib/api/schema";

export type MerchantStatus = components["schemas"]["Merchant"]["status"];

export const merchantStatusLabels: Record<MerchantStatus, string> = {
  DRAFT: "En preparación",
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  ENDED: "Finalizado",
};

// Mismas transiciones que valida la API (resto-api/src/modules/merchants/merchant-status.ts).
const transitions: Record<MerchantStatus, MerchantStatus[]> = {
  DRAFT: ["ACTIVE"],
  ACTIVE: ["PAUSED", "ENDED"],
  PAUSED: ["ACTIVE", "ENDED"],
  ENDED: [],
};

export function nextMerchantStatuses(status: MerchantStatus): MerchantStatus[] {
  return transitions[status];
}
