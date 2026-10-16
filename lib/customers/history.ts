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
