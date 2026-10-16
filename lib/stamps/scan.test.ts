import { describe, expect, it } from "vitest";
import { balanceAfterStamp, timeAgo } from "./scan";

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
