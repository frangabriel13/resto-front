import type { CustomerHistoryEntry } from "./types";

export function historyTitle(entry: CustomerHistoryEntry): string {
  if (entry.type === "REDEMPTION") return `Canje: ${entry.rewardDescription}`;
  const details = [entry.source === "MANUAL" && "manual", entry.cooldownOverride && "otro consumo"]
    .filter(Boolean)
    .join(", ");
  return details ? `Sello (${details})` : "Sello";
}

export function historyActor(entry: CustomerHistoryEntry): string {
  return entry.type === "REDEMPTION" ? entry.confirmedBy : entry.grantedBy;
}

export function voidedText(voided: NonNullable<CustomerHistoryEntry["voided"]>): string {
  const by = voided.by ? ` por ${voided.by}` : "";
  return voided.reason ? `Anulado${by}: ${voided.reason}` : `Anulado${by}`;
}

type VoidContext = { currentCycle: number; isOwner: boolean; history: CustomerHistoryEntry[] };

// Por qué el dueño no puede anular el último canje todavía: la tarjeta nueva ya tiene sellos.
export function redemptionVoidHint(entry: CustomerHistoryEntry, context: VoidContext): string | null {
  if (entry.type !== "REDEMPTION" || entry.voided || entry.canVoid || !context.isOwner) return null;
  if (entry.cycle !== context.currentCycle - 1) return null;
  const stamps = context.history.filter(
    (other) => other.type === "STAMP" && other.cycle === context.currentCycle && !other.voided,
  ).length;
  if (stamps === 0) return null;
  const count = stamps === 1 ? "el sello" : `los ${stamps} sellos`;
  return `Para anular este canje, primero anulá ${count} de la tarjeta nueva.`;
}
