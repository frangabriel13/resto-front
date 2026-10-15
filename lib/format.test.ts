import { describe, expect, it } from "vitest";
import { formatDate } from "./format";

describe("formatDate", () => {
  it("muestra la fecha en castellano", () => {
    expect(formatDate("2026-10-14T15:00:00Z")).toBe("14 de octubre de 2026");
  });

  it("usa la hora de Argentina, no la UTC", () => {
    expect(formatDate("2026-10-15T02:30:00Z")).toBe("14 de octubre de 2026");
  });
});
