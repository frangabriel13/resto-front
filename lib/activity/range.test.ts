import { describe, expect, it } from "vitest";
import { activePreset, addDays, dayInAR, daySpan, parseRange, presetRange } from "./range";

const today = "2026-10-20";

describe("dayInAR", () => {
  it("usa el día de Argentina, no el de UTC", () => {
    // 01:30 UTC del 21 son las 22:30 del 20 en Buenos Aires.
    expect(dayInAR(new Date("2026-10-21T01:30:00Z"))).toBe("2026-10-20");
  });
});

describe("addDays y daySpan", () => {
  it("cruza meses", () => {
    expect(addDays("2026-10-01", -1)).toBe("2026-09-30");
    expect(daySpan({ from: "2026-09-30", to: "2026-10-01" })).toBe(2);
  });
});

describe("presetRange", () => {
  it("arma los accesos rápidos", () => {
    expect(presetRange("today", today)).toEqual({ from: today, to: today });
    expect(presetRange("yesterday", today)).toEqual({ from: "2026-10-19", to: "2026-10-19" });
    expect(presetRange("week", today)).toEqual({ from: "2026-10-14", to: today });
    expect(presetRange("month", today)).toEqual({ from: "2026-09-21", to: today });
  });

  it("reconoce qué acceso rápido está elegido", () => {
    expect(activePreset({ from: "2026-10-14", to: today }, today)).toBe("week");
    expect(activePreset({ from: "2026-10-01", to: "2026-10-05" }, today)).toBeNull();
  });
});

describe("parseRange", () => {
  it("sin fechas, hoy", () => {
    expect(parseRange({}, today)).toEqual({ range: { from: today, to: today } });
  });

  it("con una sola fecha, ese día", () => {
    expect(parseRange({ desde: "2026-10-05" }, today).range).toEqual({ from: "2026-10-05", to: "2026-10-05" });
  });

  it("acepta un rango válido", () => {
    expect(parseRange({ desde: "2026-10-01", hasta: "2026-10-10" }, today)).toEqual({
      range: { from: "2026-10-01", to: "2026-10-10" },
    });
  });

  it("rechaza fechas inválidas, invertidas o de más de un año", () => {
    expect(parseRange({ desde: "2026-02-30", hasta: today }, today).error).toMatch(/no son válidas/);
    expect(parseRange({ desde: "hola" }, today).error).toMatch(/no son válidas/);
    expect(parseRange({ desde: "2026-10-10", hasta: "2026-10-01" }, today).error).toMatch(/posterior/);
    expect(parseRange({ desde: "2025-01-01", hasta: today }, today).error).toMatch(/hasta un año/);
  });
});
