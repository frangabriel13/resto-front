import type { MerchantStatus } from "@/lib/merchants/status";
import type { StaffMember } from "./types";

// Dueños primero, después los activos, y por nombre.
export function sortTeam(members: StaffMember[]): StaffMember[] {
  const rank = (m: StaffMember) => (m.role === "OWNER" ? 0 : m.active ? 1 : 2);
  return [...members].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "es"));
}

export function memberStatus(member: StaffMember): { label: string; tone: "ok" | "pending" | "off" } {
  if (!member.active) return { label: "Dado de baja", tone: "off" };
  if (member.pendingFirstLogin) return { label: "Todavía no ingresó", tone: "pending" };
  return { label: "Activo", tone: "ok" };
}

// El alta y la reactivación, solo con el club en preparación o activo; la baja y la contraseña,
// siempre (son de seguridad). A los dueños los gestiona Clubsy.
export function canAddStaff(status: MerchantStatus): boolean {
  return status === "DRAFT" || status === "ACTIVE";
}

export function memberActions(member: StaffMember, status: MerchantStatus) {
  if (member.role === "OWNER") return { deactivate: false, reactivate: false, resetPassword: false };
  return {
    deactivate: member.active,
    reactivate: !member.active && canAddStaff(status),
    resetPassword: member.active,
  };
}
