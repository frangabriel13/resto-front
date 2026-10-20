// Días `YYYY-MM-DD` en hora de Argentina, como los espera la API.
export type DayRange = { from: string; to: string };

const arDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Argentina/Buenos_Aires",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dayInAR(date: Date): string {
  return arDay.format(date);
}

const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDay(day: string): boolean {
  if (!dayPattern.test(day)) return false;
  const date = new Date(`${day}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(day);
}

export function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daySpan({ from, to }: DayRange): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;
}

export const presets = [
  { key: "today", label: "Hoy", back: 0, length: 1 },
  { key: "yesterday", label: "Ayer", back: 1, length: 1 },
  { key: "week", label: "7 días", back: 0, length: 7 },
  { key: "month", label: "30 días", back: 0, length: 30 },
] as const;

export type PresetKey = (typeof presets)[number]["key"];

export function presetRange(key: PresetKey, today: string): DayRange {
  const preset = presets.find((p) => p.key === key)!;
  const to = addDays(today, -preset.back);
  return { from: addDays(to, -(preset.length - 1)), to };
}

export function activePreset(range: DayRange, today: string): PresetKey | null {
  const match = presets.find((p) => {
    const candidate = presetRange(p.key, today);
    return candidate.from === range.from && candidate.to === range.to;
  });
  return match?.key ?? null;
}

const maxDays = 366;

// Rango de la URL (?desde=&hasta=). Sin fechas, hoy; si no sirve, hoy con un aviso.
export function parseRange(
  params: { desde?: string | string[]; hasta?: string | string[] },
  today: string,
): { range: DayRange; error?: string } {
  const from = typeof params.desde === "string" ? params.desde : undefined;
  const to = typeof params.hasta === "string" ? params.hasta : undefined;
  const fallback = presetRange("today", today);
  if (!from && !to) return { range: fallback };
  const range = { from: from ?? to!, to: to ?? from! };
  if (!isValidDay(range.from) || !isValidDay(range.to)) {
    return { range: fallback, error: "Las fechas no son válidas. Te mostramos lo de hoy." };
  }
  if (range.from > range.to) {
    return { range: fallback, error: "La fecha de inicio es posterior a la de fin. Te mostramos lo de hoy." };
  }
  if (daySpan(range) > maxDays) {
    return { range: fallback, error: "Elegí un período de hasta un año. Te mostramos lo de hoy." };
  }
  return { range };
}

export function rangeQuery({ from, to }: DayRange): string {
  return new URLSearchParams({ desde: from, hasta: to }).toString();
}
