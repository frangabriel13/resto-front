import { SectionCard } from "@/components/section-card";
import type { Stats } from "@/lib/activity/types";
import { DailyChart } from "./daily-chart";
import { StatGrid, StatTile } from "./stat-tile";

export function ClubSummary({ stats }: { stats: Stats }) {
  const { members, period } = stats;
  return (
    <>
      <SectionCard title="Tu club" description="Cómo está hoy.">
        <StatGrid>
          <StatTile label="Clientes" value={members.active} />
          <StatTile label="Volvieron" value={members.returning} hint="2 o más sellos" />
          <StatTile label="Aceptan novedades" value={members.marketingConsent} />
        </StatGrid>
      </SectionCard>
      <SectionCard title="Últimos 30 días">
        <div className="flex flex-col gap-5">
          <StatGrid>
            <StatTile label="Altas" value={period.joined} />
            <StatTile label="Sellos" value={period.stamps} />
            <StatTile label="Canjes" value={period.redemptions} />
          </StatGrid>
          <DailyChart daily={stats.daily} />
        </div>
      </SectionCard>
    </>
  );
}
