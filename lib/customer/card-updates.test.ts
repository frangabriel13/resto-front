import { describe, expect, it } from "vitest";
import { cardChange, changeMessage } from "./card-updates";
import type { CardHistoryEntry } from "./types";

const entry = (id: string, cycle = 1, voided = false): CardHistoryEntry => ({
  type: "STAMP",
  id: `01a14199-48e0-7655-a7cc-${id.padStart(12, "0")}`,
  at: "2026-10-16T12:00:00.000Z",
  cycle,
  voided,
});
const snapshot = (cycle: number, balance: number, history: CardHistoryEntry[], stampsRequired = 8) => ({
  cycle,
  balance,
  canRedeem: balance >= stampsRequired,
  history,
});

describe("cardChange", () => {
  const before = snapshot(1, 3, [entry("3"), entry("2"), entry("1")]);

  it("sin cambios", () => {
    expect(cardChange(before, snapshot(1, 3, [entry("3"), entry("2"), entry("1")]))).toBeNull();
  });

  it("un sello nuevo", () => {
    expect(cardChange(before, snapshot(1, 4, [entry("4"), ...before.history]))).toBe("stamped");
  });

  it("un canje pasa a la tarjeta siguiente", () => {
    expect(cardChange(before, snapshot(2, 0, before.history))).toBe("redeemed");
  });

  it("una anulación cambia la tarjeta sin ser un sello nuevo", () => {
    expect(cardChange(before, snapshot(1, 2, [entry("3", 1, true), entry("2"), entry("1")]))).toBe("updated");
  });
});

describe("changeMessage", () => {
  const before = snapshot(1, 7, []);

  it("festeja el sello y avisa si completó la tarjeta", () => {
    expect(changeMessage("stamped", snapshot(1, 6, []), snapshot(1, 5, []))).toBe("¡Sumaste un sello!");
    expect(changeMessage("stamped", snapshot(1, 8, []), before)).toBe("¡Sumaste un sello! Completaste tu tarjeta.");
  });

  it("si se sumaron varios mientras no miraba, los cuenta", () => {
    expect(changeMessage("stamped", snapshot(1, 5, []), snapshot(1, 3, []))).toBe("¡Sumaste 2 sellos!");
  });

  it("canje: arranca la tarjeta siguiente", () => {
    expect(changeMessage("redeemed", snapshot(2, 0, []), snapshot(1, 8, []))).toBe(
      "¡Canjeaste tu premio! Arrancás la tarjeta n.º 2.",
    );
  });

  it("una anulación no muestra aviso", () => {
    expect(changeMessage("updated", snapshot(1, 2, []), before)).toBeNull();
  });
});
