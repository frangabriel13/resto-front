import type { Stats } from "@/lib/activity/types";

export type Bar = { day: string; value: number; ratio: number };

// Altura relativa de cada día respecto del máximo del período.
export function dailyBars(daily: Stats["daily"]): { bars: Bar[]; max: number; total: number } {
  const max = Math.max(0, ...daily.map((d) => d.stamps));
  const bars = daily.map((d) => ({ day: d.day, value: d.stamps, ratio: max === 0 ? 0 : d.stamps / max }));
  return { bars, max, total: daily.reduce((sum, d) => sum + d.stamps, 0) };
}
