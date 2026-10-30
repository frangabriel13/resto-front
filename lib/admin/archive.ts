import type { MerchantStatus } from "@/lib/merchants/status";

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

// "Tiene 3 clientes", con la cantidad que manda la API en `MERCHANT_HAS_CUSTOMERS`.
export function hasCustomersMessage(details: unknown): string {
  const customers =
    details && typeof details === "object" && "customers" in details && typeof details.customers === "number"
      ? details.customers
      : null;
  const who = customers === null ? "Tiene o tuvo clientes" : customers === 1 ? "Tiene 1 cliente" : `Tiene ${customers} clientes`;
  return `${who}: no se puede borrar. Si ya no va a usar Clubsy, finalizá el club y archivalo.`;
}
