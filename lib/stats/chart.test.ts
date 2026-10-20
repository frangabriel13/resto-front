import { describe, expect, it } from "vitest";
import { dailyBars } from "./chart";

const day = (d: string, stamps: number) => ({ day: d, joined: 0, stamps, redemptions: 0 });

describe("dailyBars", () => {
  it("escala contra el día con más sellos", () => {
    const { bars, max, total } = dailyBars([day("2026-10-19", 2), day("2026-10-20", 4)]);
    expect(max).toBe(4);
    expect(total).toBe(6);
    expect(bars.map((b) => b.ratio)).toEqual([0.5, 1]);
  });

  it("sin sellos, todas las barras en cero", () => {
    expect(dailyBars([day("2026-10-20", 0)]).bars[0].ratio).toBe(0);
  });
});
