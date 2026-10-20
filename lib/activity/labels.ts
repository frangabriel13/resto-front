import { addDays, type DayRange } from "./range";

// Los días son fechas sin hora: se formatean en UTC para que no se corran.
const longDay = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
const shortDay = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", day: "numeric", month: "short" });
const monthDay = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", day: "numeric", month: "long" });
const monthDayYear = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });

const asDate = (day: string) => new Date(`${day}T00:00:00Z`);

export function dayLabel(day: string, today: string): string {
  if (day === today) return "Hoy";
  if (day === addDays(today, -1)) return "Ayer";
  const label = longDay.format(asDate(day));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function shortDayLabel(day: string): string {
  return shortDay.format(asDate(day));
}

export function rangeLabel({ from, to }: DayRange, today: string): string {
  if (from === to) return dayLabel(from, today);
  return `Del ${monthDay.format(asDate(from))} al ${monthDayYear.format(asDate(to))}`;
}
