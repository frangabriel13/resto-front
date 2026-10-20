export function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-muted/60 px-4 py-3">
      <span className="font-heading text-2xl font-semibold text-primary tabular-nums">
        {value.toLocaleString("es-AR")}
      </span>
      <span className="text-sm">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-2">{children}</div>;
}
