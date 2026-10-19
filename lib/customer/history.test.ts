import { describe, expect, it } from "vitest";
import { cycleLabel, entryLabel, groupByCycle } from "./history";
import type { CardHistoryEntry } from "./types";

let n = 0;
const id = () => `01a14199-48e0-7655-a7cc-${String(++n).padStart(12, "0")}`;
const stamp = (cycle: number, voided = false): CardHistoryEntry => ({
  type: "STAMP",
  id: id(),
  at: "2026-10-16T12:00:00.000Z",
  cycle,
  voided,
});
const redemption = (cycle: number, voided = false): CardHistoryEntry => ({
  type: "REDEMPTION",
  id: id(),
  at: "2026-10-16T12:00:00.000Z",
  cycle,
  voided,
  rewardDescription: "Un café",
});

describe("groupByCycle", () => {
  it("separa por tarjeta y marca la actual y las canjeadas", () => {
    const groups = groupByCycle([stamp(2), redemption(1), stamp(1), stamp(1)], 2);
    expect(groups.map((g) => [g.cycle, g.current, g.redeemed, g.entries.length])).toEqual([
      [2, true, false, 1],
      [1, false, true, 3],
    ]);
  });

  it("un canje anulado no cuenta como canjeada", () => {
    const [group] = groupByCycle([redemption(1, true), stamp(1)], 1);
    expect(group.redeemed).toBe(false);
  });

  it("sin movimientos, sin grupos", () => {
    expect(groupByCycle([], 1)).toEqual([]);
  });
});

describe("cycleLabel", () => {
  it("dice si es la actual o si ya se canjeó", () => {
    expect(cycleLabel({ cycle: 2, current: true, redeemed: false, entries: [] })).toBe("Tarjeta n.º 2 · actual");
    expect(cycleLabel({ cycle: 1, current: false, redeemed: true, entries: [] })).toBe("Tarjeta n.º 1 · canjeada");
  });
});

describe("entryLabel", () => {
  it("nombra el premio canjeado", () => {
    expect(entryLabel(redemption(1))).toBe("Canjeaste: Un café");
    expect(entryLabel(stamp(1))).toBe("Sello");
  });
});
