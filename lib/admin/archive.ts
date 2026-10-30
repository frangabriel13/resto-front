import type { components } from "@/lib/api/schema";
import type { MerchantStatus } from "@/lib/merchants/status";

export type DeletionSummary = components["schemas"]["MerchantDeletionSummary"];

// Como la API: un club abierto (activo o pausado) primero se finaliza.
export const canArchive = (status: MerchantStatus) => status === "DRAFT" || status === "ENDED";

// La confirmación del borrado compara como la API: sin mayúsculas ni espacios en los extremos.
const normalize = (value: string) => value.trim().toLocaleLowerCase("es");
export const confirmsName = (input: string, name: string) =>
  input.trim() !== "" && normalize(input) === normalize(name);

export function deletePiecesWarning(count: number): string {
  if (count === 1) {
    return "Tiene 1 pieza: deja de funcionar. Antes de borrarlo, sacale la contraseña al chip (la ves en la pieza): sin ella, un chip protegido no se puede volver a grabar.";
  }
  return `Tiene ${count} piezas: dejan de funcionar. Antes de borrarlo, sacales la contraseña a los chips (la ves en cada pieza): sin ella, un chip protegido no se puede volver a grabar.`;
}

export function archiveWarning(activePieces: number): string {
  const base = "Sale del listado (queda en “Archivados”) y no se puede editar hasta desarchivarlo.";
  if (activePieces === 0) return base;
  if (activePieces === 1) {
    return `${base} Su pieza activa se desactiva y deja de funcionar; al desarchivarlo, hay que reactivarla a mano.`;
  }
  return `${base} Sus ${activePieces} piezas activas se desactivan y dejan de funcionar; al desarchivarlo, hay que reactivarlas a mano.`;
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const customersText = (customers: number | null) =>
  customers === null ? "Tiene o tuvo clientes" : `Tiene ${count(customers, "cliente", "clientes")}`;

// Con clientes solo se borra archivado; un club abierto, además, primero se finaliza.
export function deleteBlockedReason(summary: DeletionSummary, status: MerchantStatus): string | null {
  if (summary.canDelete) return null;
  const steps = canArchive(status) ? "archivalo" : "finalizá el club y archivalo";
  return `${customersText(summary.customers)}: para borrarlo, primero ${steps}.`;
}

// Si un cliente se sumó después de cargar la página, la API lo rechaza con la cantidad.
export function hasCustomersMessage(details: unknown): string {
  const customers =
    details && typeof details === "object" && "customers" in details && typeof details.customers === "number"
      ? details.customers
      : null;
  return `${customersText(customers)}: para borrarlo, primero archivalo.`;
}

// Lo que se borra, para la confirmación; solo lo que tiene.
export function deletionItems(summary: DeletionSummary): string[] {
  const items = [
    summary.customers > 0 &&
      `${count(summary.customers, "cliente", "clientes")} del club, con ${count(summary.stamps, "sello", "sellos")} y ${count(summary.redemptions, "canje", "canjes")}`,
    summary.customerAccounts === 1 &&
      "1 cuenta de cliente que no está en otro club: se borra como si la borrara el cliente",
    summary.customerAccounts > 1 &&
      `${summary.customerAccounts} cuentas de clientes que no están en otro club: se borran como si las borrara cada cliente`,
    summary.pieces > 0 && count(summary.pieces, "pieza", "piezas"),
    summary.staffUsers > 0 &&
      `${count(summary.staffUsers, "usuario del panel que no está", "usuarios del panel que no están")} en otro comercio`,
  ];
  return [
    "La ficha, la marca, el premio y el historial del comercio",
    ...items.filter((item): item is string => typeof item === "string"),
  ];
}
