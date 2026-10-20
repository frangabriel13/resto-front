import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivityList } from "@/components/activity/activity-list";
import { PeriodTotals } from "@/components/activity/period-totals";
import { RangeFilter } from "@/components/activity/range-filter";
import { FormAlert } from "@/components/form/form-alert";
import { LoadingBlock } from "@/components/loading-block";
import { PageHeader } from "@/components/panel/page-header";
import { getActivity, getStats, todayInAR } from "@/lib/activity/data";
import { parseRange } from "@/lib/activity/range";
import { requirePanelSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Actividad" };

export default function ActivityPage({ searchParams }: PageProps<"/panel/actividad">) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader title="Actividad" description="Sellos, canjes y altas del comercio." />
      <Suspense fallback={<LoadingBlock />}>
        <ActivityContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ActivityContent({ searchParams }: Pick<PageProps<"/panel/actividad">, "searchParams">) {
  const [params] = await Promise.all([searchParams, requirePanelSession()]);
  const today = await todayInAR();
  const { range, error } = parseRange(params, today);
  const [stats, activity] = await Promise.all([getStats(range), getActivity(range)]);

  return (
    <div className="flex flex-col gap-6">
      <RangeFilter range={range} today={today} />
      <FormAlert message={error} />
      <PeriodTotals period={stats.period} />
      <ActivityList key={`${range.from}-${range.to}`} initial={activity} range={range} today={today} />
    </div>
  );
}
