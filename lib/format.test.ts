import { describe, expect, it } from "vitest";
import { formatCountdown, formatDate, formatDateTime } from "./format";

describe("formatDate", () => {
  it("muestra la fecha en castellano", () => {
    expect(formatDate("2026-10-14T15:00:00Z")).toBe("14 de octubre de 2026");
  });

  it("usa la hora de Argentina, no la UTC", () => {
    expect(formatDate("2026-10-15T02:30:00Z")).toBe("14 de octubre de 2026");
  });
});

describe("formatCountdown", () => {
  it("muestra minutos y segundos con dos cifras", () => {
    expect(formatCountdown(60)).toBe("1:00");
    expect(formatCountdown(45)).toBe("0:45");
    expect(formatCountdown(5)).toBe("0:05");
  });

  it("redondea para arriba y nunca muestra negativos", () => {
    expect(formatCountdown(4.2)).toBe("0:05");
    expect(formatCountdown(-3)).toBe("0:00");
  });
});

describe("formatDateTime", () => {
  it("muestra fecha corta y hora de 24 horas en Argentina", () => {
    expect(formatDateTime("2026-10-15T02:30:00Z")).toBe("14 de oct de 2026 · 23:30");
    expect(formatDateTime("2026-10-15T12:05:00Z")).toBe("15 de oct de 2026 · 09:05");
  });
});
