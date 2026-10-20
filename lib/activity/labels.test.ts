import { describe, expect, it } from "vitest";
import { dayLabel, rangeLabel, shortDayLabel } from "./labels";

const today = "2026-10-20";

describe("dayLabel", () => {
  it("hoy, ayer o el día de la semana", () => {
    expect(dayLabel(today, today)).toBe("Hoy");
    expect(dayLabel("2026-10-19", today)).toBe("Ayer");
    expect(dayLabel("2026-10-16", today)).toBe("Viernes, 16 de octubre");
  });
});

describe("rangeLabel", () => {
  it("un día o un rango", () => {
    expect(rangeLabel({ from: today, to: today }, today)).toBe("Hoy");
    expect(rangeLabel({ from: "2026-10-14", to: today }, today)).toBe("Del 14 de octubre al 20 de octubre de 2026");
  });
});

describe("shortDayLabel", () => {
  it("no se corre de día", () => {
    expect(shortDayLabel("2026-10-01")).toBe("1 oct");
  });
});
