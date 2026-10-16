import { describe, expect, it } from "vitest";
import { historyActor, historyTitle, voidedText } from "./history";
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
