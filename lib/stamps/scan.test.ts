import { describe, expect, it } from "vitest";
import { balanceAfterStamp, balanceText, scanActions, timeAgo } from "./scan";
import type { ScanResult } from "./types";

describe("timeAgo", () => {
  const now = Date.parse("2026-10-16T12:00:00Z");
  const ago = (ms: number) => new Date(now - ms).toISOString();

  it("menos de un minuto", () => {
    expect(timeAgo(ago(30_000), now)).toBe("hace un momento");
  });

  it("minutos, en singular y plural", () => {
    expect(timeAgo(ago(60_000), now)).toBe("hace 1 minuto");
    expect(timeAgo(ago(12 * 60_000), now)).toBe("hace 12 minutos");
  });

  it("horas y minutos", () => {
    expect(timeAgo(ago(60 * 60_000), now)).toBe("hace 1 h");
    expect(timeAgo(ago(95 * 60_000), now)).toBe("hace 1 h 35 min");
  });
});

describe("balanceText", () => {
  it("muestra los sellos de más aparte", () => {
    expect(balanceText(3, 8)).toBe("3 de 8");
    expect(balanceText(10, 8)).toBe("8 de 8 y 2 para la próxima");
  });
});

describe("balanceAfterStamp", () => {
  it("suma uno a la tarjeta", () => {
    expect(balanceAfterStamp(3, 8)).toBe("4 de 8");
    expect(balanceAfterStamp(7, 8)).toBe("8 de 8");
  });

  it("los sellos de más pasan a la próxima tarjeta", () => {
    expect(balanceAfterStamp(8, 8)).toBe("8 de 8 y 1 para la próxima");
    expect(balanceAfterStamp(9, 8)).toBe("8 de 8 y 2 para la próxima");
  });
});

describe("scanActions", () => {
  const scan = (canRedeem: boolean, cooldownActive = false): ScanResult => ({
    membership: {
      id: "01a14015-6b7b-75cd-a8b2-1ae5bd684538",
      customer: { name: "Ana", phone: null },
      cycle: 1,
      balance: canRedeem ? 8 : 3,
      stampsRequired: 8,
      remaining: canRedeem ? 0 : 5,
      canRedeem,
      totalStamps: canRedeem ? 8 : 3,
    },
    cooldown: { active: cooldownActive, lastStampAt: null, retryAfterSeconds: 0 },
  });
  const active = { stampsAllowed: true, redeemAvailable: true };

  it("tarjeta completa: canjear y, aparte, sumar sello", () => {
    expect(scanActions(scan(true), active)).toEqual({ redeem: true, stamp: "normal" });
  });

  it("tarjeta incompleta: solo sumar sello", () => {
    expect(scanActions(scan(false), active)).toEqual({ redeem: false, stamp: "normal" });
  });

  it("con cooldown, el sello pide confirmar otro consumo", () => {
    expect(scanActions(scan(false, true), active).stamp).toBe("override");
  });

  it("club pausado: solo canjear", () => {
    const paused = { stampsAllowed: false, redeemAvailable: true };
    expect(scanActions(scan(true), paused)).toEqual({ redeem: true, stamp: null });
    expect(scanActions(scan(false), paused)).toEqual({ redeem: false, stamp: null });
  });

  it("sin canje disponible (sello manual desde la ficha)", () => {
    expect(scanActions(scan(true), { stampsAllowed: true, redeemAvailable: false }).redeem).toBe(false);
  });
});
