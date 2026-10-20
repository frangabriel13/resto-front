import { describe, expect, it } from "vitest";
import { activityDetail, activityTitle, customerName, groupByDay, laterVoided } from "./items";
import type { ActivityItem } from "./types";

const customer = { membershipId: "01a14199-48e0-7655-a7cc-93db24326290", name: "Ana", phone: "11 ••• 7075" };
const at = "2026-10-20T15:00:00.000Z";
const stamp = (overrides: Partial<Extract<ActivityItem, { type: "STAMP" }>> = {}): ActivityItem => ({
  type: "STAMP",
  id: "s1",
  at,
  customer,
  by: "Empleado",
  source: "QR_SCAN",
  cooldownOverride: false,
  voided: false,
  ...overrides,
});

describe("activityTitle y activityDetail", () => {
  it("sello con sus detalles", () => {
    expect(activityTitle(stamp())).toBe("Sello");
    expect(activityTitle(stamp({ source: "MANUAL", cooldownOverride: true }))).toBe("Sello (manual, otro consumo)");
    expect(activityDetail(stamp())).toBe("Por Empleado");
  });

  it("anulaciones con el motivo", () => {
    const voided: ActivityItem = { type: "STAMP_VOIDED", id: "v1", at, customer, by: "Dueña", reason: "Se cargó dos veces" };
    expect(activityTitle(voided)).toBe("Sello anulado");
    expect(activityDetail(voided)).toBe("Por Dueña: Se cargó dos veces");
  });

  it("canje con el premio", () => {
    const redemption: ActivityItem = {
      type: "REDEMPTION",
      id: "r1",
      at,
      customer,
      by: "Empleado",
      cycle: 1,
      rewardDescription: "Un café",
      voided: true,
    };
    expect(activityTitle(redemption)).toBe("Canje: Un café");
    expect(laterVoided(redemption)).toBe(true);
  });

  it("alta con la pieza y el consentimiento", () => {
    const joined: ActivityItem = { type: "JOINED", id: "j1", at, customer, pieceLabel: "Mostrador", marketingConsent: true };
    expect(activityTitle(joined)).toBe("Se sumó al club (Mostrador)");
    expect(activityDetail(joined)).toBe("Acepta recibir novedades");
    expect(activityDetail({ ...joined, marketingConsent: false })).toBeNull();
  });

  it("cuenta borrada", () => {
    expect(customerName(stamp({ customer: { ...customer, name: null, phone: null } }))).toBe("Cuenta borrada");
  });
});

describe("groupByDay", () => {
  it("agrupa por día de Argentina, respetando el orden", () => {
    const groups = groupByDay([
      stamp({ id: "a", at: "2026-10-21T01:00:00.000Z" }), // 20/10 22:00 AR
      stamp({ id: "b", at: "2026-10-20T12:00:00.000Z" }),
      stamp({ id: "c", at: "2026-10-19T12:00:00.000Z" }),
    ]);
    expect(groups.map((g) => [g.day, g.items.map((i) => i.id)])).toEqual([
      ["2026-10-20", ["a", "b"]],
      ["2026-10-19", ["c"]],
    ]);
  });
});
