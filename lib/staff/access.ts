import type { components } from "@/lib/api/schema";
import { staffRoutes, type StaffRoute } from "./routes";

export type StaffAccount = components["schemas"]["StaffAccount"];
export type StaffMerchant = StaffAccount["merchants"][number];

export function staffNextStep(account: StaffAccount | null): StaffRoute {
  if (!account) return staffRoutes.login;
  if (account.user.mustChangePassword) return staffRoutes.changePassword;
  if (!account.selectedMerchantId) return staffRoutes.selectMerchant;
  return staffRoutes.home;
}

export function staffRedirect(
  account: StaffAccount | null,
  current: StaffRoute,
): StaffRoute | null {
  const next = staffNextStep(account);
  if (next === current) return null;
  // Con el circuito completo, elegir comercio sigue disponible para cambiar de comercio.
  if (current === staffRoutes.selectMerchant && next === staffRoutes.home) {
    return null;
  }
  return next;
}

export function currentMerchant(account: StaffAccount): StaffMerchant | undefined {
  return account.merchants.find((m) => m.id === account.selectedMerchantId);
}
