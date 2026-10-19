import { describe, expect, it } from "vitest";
import { historyActor, historyTitle, redemptionVoidHint, voidedText } from "./history";
import type { CustomerHistoryEntry } from "./types";

const stamp = (overrides: Partial<Extract<CustomerHistoryEntry, { type: "STAMP" }>> = {}): CustomerHistoryEntry => ({
  type: "STAMP",
  id: "01a14199-48e0-7655-a7cc-93db24326290",
  at: "2026-10-16T12:00:00.000Z",
  cycle: 1,
  source: "QR_SCAN",
  cooldownOverride: false,
  grantedBy: "Empleado Demo",
  voided: null,
  canVoid: false,
  ...overrides,
});

describe("historyTitle", () => {
  it("sello común por QR", () => {
    expect(historyTitle(stamp())).toBe("Sello");
  });

  it("aclara si fue manual u otro consumo", () => {
    expect(historyTitle(stamp({ source: "MANUAL" }))).toBe("Sello (manual)");
    expect(historyTitle(stamp({ cooldownOverride: true }))).toBe("Sello (otro consumo)");
    expect(historyTitle(stamp({ source: "MANUAL", cooldownOverride: true }))).toBe(
      "Sello (manual, otro consumo)",
    );
  });

  it("canje con el premio", () => {
    const redemption: CustomerHistoryEntry = {
      type: "REDEMPTION",
      id: "01a14199-48e0-7655-a7cc-93db24326291",
      at: "2026-10-16T12:00:00.000Z",
      cycle: 1,
      stampsUsed: 8,
      carryOver: 0,
      rewardDescription: "Un café",
      confirmedBy: "Dueño Demo",
      voided: null,
      canVoid: false,
    };
    expect(historyTitle(redemption)).toBe("Canje: Un café");
    expect(historyActor(redemption)).toBe("Dueño Demo");
  });
});

describe("voidedText", () => {
  it("con quién y por qué", () => {
    expect(voidedText({ at: "2026-10-16T12:00:00.000Z", by: "Dueño Demo", reason: "Se cargó dos veces" })).toBe(
      "Anulado por Dueño Demo: Se cargó dos veces",
    );
  });

  it("sin datos de quién o por qué", () => {
    expect(voidedText({ at: "2026-10-16T12:00:00.000Z", by: null, reason: null })).toBe("Anulado");
  });
});

describe("redemptionVoidHint", () => {
  const redemption = (overrides: Partial<Extract<CustomerHistoryEntry, { type: "REDEMPTION" }>> = {}): CustomerHistoryEntry => ({
    type: "REDEMPTION",
    id: "01a14199-48e0-7655-a7cc-93db24326299",
    at: "2026-10-16T12:00:00.000Z",
    cycle: 1,
    stampsUsed: 8,
    carryOver: 0,
    rewardDescription: "Un café",
    confirmedBy: "Dueño Demo",
    voided: null,
    canVoid: false,
    ...overrides,
  });
  const context = (history: CustomerHistoryEntry[], isOwner = true) => ({ currentCycle: 2, isOwner, history });

  it("pide anular primero los sellos de la tarjeta nueva", () => {
    const last = redemption();
    expect(redemptionVoidHint(last, context([stamp({ cycle: 2 }), last]))).toBe(
      "Para anular este canje, primero anulá el sello de la tarjeta nueva.",
    );
    expect(redemptionVoidHint(last, context([stamp({ cycle: 2 }), stamp({ cycle: 2 }), last]))).toMatch(
      /los 2 sellos/,
    );
  });

  it("los sellos anulados no cuentan", () => {
    const last = redemption();
    const voided = { at: "2026-10-16T12:00:00.000Z", by: null, reason: null };
    expect(redemptionVoidHint(last, context([stamp({ cycle: 2, voided }), last]))).toBeNull();
  });

  it("nada si se puede anular, si no es el último o si no es el dueño", () => {
    const newStamp = stamp({ cycle: 2 });
    expect(redemptionVoidHint(redemption({ canVoid: true }), context([newStamp]))).toBeNull();
    expect(redemptionVoidHint(redemption({ cycle: 0 }), context([newStamp]))).toBeNull();
    expect(redemptionVoidHint(redemption(), context([newStamp], false))).toBeNull();
  });
});
