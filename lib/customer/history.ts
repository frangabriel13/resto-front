import type { CardHistoryEntry } from "./types";

export type CycleGroup = { cycle: number; current: boolean; redeemed: boolean; entries: CardHistoryEntry[] };

// Agrupa por tarjeta, en el orden en que llegan (lo más reciente primero).
export function groupByCycle(entries: CardHistoryEntry[], currentCycle: number): CycleGroup[] {
  const groups = new Map<number, CycleGroup>();
  for (const entry of entries) {
    let group = groups.get(entry.cycle);
    if (!group) {
      group = { cycle: entry.cycle, current: entry.cycle === currentCycle, redeemed: false, entries: [] };
      groups.set(entry.cycle, group);
    }
    group.entries.push(entry);
    if (entry.type === "REDEMPTION" && !entry.voided) group.redeemed = true;
  }
  return [...groups.values()];
}

export function cycleLabel({ cycle, current, redeemed }: CycleGroup): string {
  const state = current ? " · actual" : redeemed ? " · canjeada" : "";
  return `Tarjeta n.º ${cycle}${state}`;
}

export function entryLabel(entry: CardHistoryEntry): string {
  return entry.type === "REDEMPTION" ? `Canjeaste: ${entry.rewardDescription}` : "Sello";
}
