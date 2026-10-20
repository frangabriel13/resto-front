import { StatGrid, StatTile } from "@/components/stats/stat-tile";
import type { Stats } from "@/lib/activity/types";

// Lo que conviene que el dueño controle: sellos sin QR, cooldown salteado y anulaciones.
function controlText(period: Stats["period"]): string {
  const parts = [
    `${period.manualStamps} ${period.manualStamps === 1 ? "sello manual" : "sellos manuales"}`,
    `${period.cooldownOverrides} por otro consumo`,
    `${period.voidedStamps} ${period.voidedStamps === 1 ? "sello anulado" : "sellos anulados"}`,
    `${period.voidedRedemptions} ${period.voidedRedemptions === 1 ? "canje anulado" : "canjes anulados"}`,
  ];
  return parts.join(" · ");
}

export function PeriodTotals({ period }: { period: Stats["period"] }) {
  return (
    <div className="flex flex-col gap-2">
      <StatGrid>
        <StatTile label="Sellos" value={period.stamps} />
        <StatTile label="Canjes" value={period.redemptions} />
        <StatTile label="Altas" value={period.joined} />
      </StatGrid>
      <p className="text-xs text-muted-foreground">{controlText(period)}</p>
    </div>
  );
}
