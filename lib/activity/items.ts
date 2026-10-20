import { dayInAR } from "./range";
import type { ActivityItem } from "./types";

export function customerName(item: ActivityItem): string {
  return item.customer.name ?? "Cuenta borrada";
}

export function activityTitle(item: ActivityItem): string {
  switch (item.type) {
    case "STAMP": {
      const details = [item.source === "MANUAL" && "manual", item.cooldownOverride && "otro consumo"]
        .filter(Boolean)
        .join(", ");
      return details ? `Sello (${details})` : "Sello";
    }
    case "STAMP_VOIDED":
      return "Sello anulado";
    case "REDEMPTION":
      return `Canje: ${item.rewardDescription}`;
    case "REDEMPTION_VOIDED":
      return "Canje anulado";
    case "JOINED":
      return item.pieceLabel ? `Se sumó al club (${item.pieceLabel})` : "Se sumó al club";
  }
}

// Quién lo hizo y, en las anulaciones, por qué.
export function activityDetail(item: ActivityItem): string | null {
  switch (item.type) {
    case "STAMP":
    case "REDEMPTION":
      return `Por ${item.by}`;
    case "STAMP_VOIDED":
    case "REDEMPTION_VOIDED":
      return item.reason ? `Por ${item.by}: ${item.reason}` : `Por ${item.by}`;
    case "JOINED":
      return item.marketingConsent ? "Acepta recibir novedades" : null;
  }
}

// Un sello o canje que después se anuló (la anulación aparece aparte, como su propio movimiento).
export function laterVoided(item: ActivityItem): boolean {
  return (item.type === "STAMP" || item.type === "REDEMPTION") && item.voided;
}

export type DayGroup = { day: string; items: ActivityItem[] };

export function groupByDay(items: ActivityItem[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const item of items) {
    const day = dayInAR(new Date(item.at));
    const last = groups.at(-1);
    if (last?.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }
  return groups;
}
