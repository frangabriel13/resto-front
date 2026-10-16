import { describe, expect, it } from "vitest";
import { localExpiry, nextRefreshDelay, retryDelay, showStampQr } from "./stamp-qr";

describe("showStampQr", () => {
  it("con el club activo, siempre", () => {
    expect(showStampQr("ACTIVE", false)).toBe(true);
    expect(showStampQr("ACTIVE", true)).toBe(true);
  });

  it("con el club pausado, solo para canjear una tarjeta completa", () => {
    expect(showStampQr("PAUSED", true)).toBe(true);
    expect(showStampQr("PAUSED", false)).toBe(false);
  });

  it("con el club finalizado o en preparación, nunca", () => {
    expect(showStampQr("ENDED", true)).toBe(false);
    expect(showStampQr("DRAFT", true)).toBe(false);
  });
});

describe("nextRefreshDelay", () => {
  const now = 1_000_000;

  it("usa el intervalo que indica la API", () => {
    expect(nextRefreshDelay(60, now + 120_000, now)).toBe(60_000);
  });

  it("renueva antes de que venza si el intervalo llegaría tarde", () => {
    expect(nextRefreshDelay(60, now + 30_000, now)).toBe(25_000);
  });

  it("nunca programa menos de un segundo", () => {
    expect(nextRefreshDelay(60, now + 2_000, now)).toBe(1_000);
  });
});

describe("retryDelay", () => {
  it("espera cada vez más, hasta 15 segundos", () => {
    expect(retryDelay(1)).toBe(2_000);
    expect(retryDelay(2)).toBe(4_000);
    expect(retryDelay(3)).toBe(8_000);
    expect(retryDelay(10)).toBe(15_000);
  });
});

describe("localExpiry", () => {
  const serverDate = "Fri, 16 Oct 2026 01:00:00 GMT";
  const expiresAt = "2026-10-16T01:02:00.000Z"; // 2 minutos después, según el servidor

  it("con el reloj del celular en hora, vence cuando dice el servidor", () => {
    const receivedAt = Date.parse("2026-10-16T01:00:00Z");
    expect(localExpiry(expiresAt, serverDate, receivedAt)).toBe(receivedAt + 120_000);
  });

  it("con el reloj del celular adelantado, le quedan igual 2 minutos", () => {
    const receivedAt = Date.parse("2026-10-16T01:10:00Z");
    expect(localExpiry(expiresAt, serverDate, receivedAt)).toBe(receivedAt + 120_000);
  });

  it("con el reloj del celular atrasado, también", () => {
    const receivedAt = Date.parse("2026-10-16T00:50:00Z");
    expect(localExpiry(expiresAt, serverDate, receivedAt)).toBe(receivedAt + 120_000);
  });

  it("sin la hora del servidor, usa el reloj del celular", () => {
    const receivedAt = Date.parse("2026-10-16T01:01:00Z");
    expect(localExpiry(expiresAt, null, receivedAt)).toBe(Date.parse(expiresAt));
  });
});
