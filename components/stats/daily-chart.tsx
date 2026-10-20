"use client";

import { useState } from "react";
import { shortDayLabel } from "@/lib/activity/labels";
import { dailyBars } from "@/lib/stats/chart";
import type { Stats } from "@/lib/activity/types";
import { stampCount } from "@/lib/text";
import { cn } from "@/lib/utils";

// Sellos por día. Tocar o pasar por una barra muestra su valor arriba.
export function DailyChart({ daily }: { daily: Stats["daily"] }) {
  const { bars, max, total } = dailyBars(daily);
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected === null ? null : bars[selected];

  if (bars.length === 0) return null;

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">Sellos por día</span>
        <span aria-live="polite" className="text-muted-foreground tabular-nums">
          {current ? (
            <>
              <span className="font-semibold text-foreground">{stampCount(current.value)}</span> el{" "}
              {shortDayLabel(current.day)}
            </>
          ) : (
            `Máximo: ${stampCount(max)} en un día`
          )}
        </span>
      </figcaption>
      <ol
        aria-label={`Sellos por día: ${stampCount(total)} en total`}
        className="flex h-28 items-end gap-0.5 border-b border-border"
        onPointerLeave={() => setSelected(null)}
      >
        {bars.map((bar, index) => (
          <li
            key={bar.day}
            tabIndex={0}
            aria-label={`${shortDayLabel(bar.day)}: ${stampCount(bar.value)}`}
            className="group flex h-full min-w-0 flex-1 cursor-default items-end outline-none"
            onPointerEnter={() => setSelected(index)}
            onPointerDown={() => setSelected(index)}
            onFocus={() => setSelected(index)}
            onBlur={() => setSelected(null)}
          >
            <span
              className={cn(
                "block w-full rounded-t-[4px] bg-brand transition-opacity",
                bar.value === 0 && "bg-transparent",
                selected !== null && selected !== index && "opacity-50",
                "group-focus-visible:ring-2 group-focus-visible:ring-ring",
              )}
              style={{ height: bar.value === 0 ? 0 : `max(${bar.ratio * 100}%, 3px)` }}
            />
          </li>
        ))}
      </ol>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{shortDayLabel(bars[0].day)}</span>
        <span>{shortDayLabel(bars.at(-1)!.day)}</span>
      </div>
    </figure>
  );
}
