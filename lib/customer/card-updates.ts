import { stampCount } from "@/lib/text";
import type { MembershipCard } from "./types";

type Snapshot = Pick<MembershipCard, "cycle" | "balance" | "canRedeem" | "history">;

export type CardChange = "redeemed" | "stamped" | "updated";

export const pollIntervalMs = 5_000;
// Sin cambios en este tiempo deja de consultar, hasta que el cliente vuelva a la pestaña.
export const pollWindowMs = 5 * 60_000;

const fingerprint = ({ cycle, balance, history }: Snapshot) =>
  `${cycle}|${balance}|${history.map((entry) => `${entry.id}${entry.voided ? "x" : ""}`).join(",")}`;

export function cardChange(previous: Snapshot, next: Snapshot): CardChange | null {
  if (fingerprint(previous) === fingerprint(next)) return null;
  if (next.cycle > previous.cycle) return "redeemed";
  if (next.cycle === previous.cycle && next.balance > previous.balance) return "stamped";
  return "updated";
}

// Aviso para el cliente; `null` si el cambio no amerita (por ejemplo, una anulación).
export function changeMessage(change: CardChange, next: Snapshot, previous: Snapshot): string | null {
  if (change === "redeemed") return `¡Canjeaste tu premio! Arrancás la tarjeta n.º ${next.cycle}.`;
  if (change !== "stamped") return null;
  const added = next.balance - previous.balance;
  const text = added === 1 ? "¡Sumaste un sello!" : `¡Sumaste ${stampCount(added)}!`;
  return next.canRedeem && !previous.canRedeem ? `${text} Completaste tu tarjeta.` : text;
}
