"use client";

import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rangeLabel } from "@/lib/activity/labels";
import { activePreset, presetRange, presets, rangeQuery, type DayRange } from "@/lib/activity/range";
import { panelRoutes } from "@/lib/staff/routes";

export function RangeFilter({ range, today }: { range: DayRange; today: string }) {
  const router = useRouter();
  const current = activePreset(range, today);
  const [custom, setCustom] = useState(current === null);
  const [from, setFrom] = useState(range.from);
  const [to, setTo] = useState(range.to);
  const [shown, setShown] = useState(range);

  // Al cambiar el rango, el formulario sigue al nuevo. No se usa `key`: al cambiarla, la copia
  // anterior del filtro (con el link que se tocó) quedaba en pantalla junto a la nueva.
  if (shown.from !== range.from || shown.to !== range.to) {
    setShown(range);
    setFrom(range.from);
    setTo(range.to);
    setCustom(current === null);
  }

  function apply(event: React.FormEvent) {
    event.preventDefault();
    router.push(`${panelRoutes.activity}?${rangeQuery({ from, to })}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.key}
            asChild
            size="sm"
            variant={current === preset.key ? "default" : "outline"}
            className="h-9 rounded-full"
          >
            <Link
              href={`${panelRoutes.activity}?${rangeQuery(presetRange(preset.key, today))}`}
              aria-current={current === preset.key ? "true" : undefined}
            >
              {preset.label}
            </Link>
          </Button>
        ))}
        <Button
          size="sm"
          variant={current === null ? "default" : "outline"}
          className="h-9 rounded-full"
          aria-expanded={custom}
          onClick={() => setCustom((open) => !open)}
        >
          <CalendarIcon />
          Elegir fechas
        </Button>
      </div>

      {custom && (
        <form onSubmit={apply} className="flex flex-wrap items-end gap-3 rounded-xl border p-3">
          <DateField label="Desde" value={from} max={today} onChange={setFrom} />
          <DateField label="Hasta" value={to} max={today} onChange={setTo} />
          <Button type="submit" className="h-10">
            Ver
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground">{rangeLabel(range, today)}</p>
    </div>
  );
}

function DateField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max: string;
  onChange: (value: string) => void;
}) {
  const id = `fecha-${label.toLowerCase()}`;
  return (
    <div className="flex min-w-36 flex-1 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="date" value={value} max={max} required onChange={(e) => onChange(e.target.value)} className="h-10" />
    </div>
  );
}
