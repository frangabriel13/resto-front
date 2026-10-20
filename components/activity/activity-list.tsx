"use client";

import { BanIcon, ChevronRightIcon, GiftIcon, StampIcon, UserPlusIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { activityDetail, activityTitle, customerName, groupByDay, laterVoided } from "@/lib/activity/items";
import { dayLabel } from "@/lib/activity/labels";
import type { DayRange } from "@/lib/activity/range";
import type { ActivityItem, ActivityPage } from "@/lib/activity/types";
import { panelCustomerRoute } from "@/lib/staff/routes";
import { cn } from "@/lib/utils";

const icons: Record<ActivityItem["type"], LucideIcon> = {
  STAMP: StampIcon,
  STAMP_VOIDED: BanIcon,
  REDEMPTION: GiftIcon,
  REDEMPTION_VOIDED: BanIcon,
  JOINED: UserPlusIcon,
};

const timeFormat = new Intl.DateTimeFormat("es-AR", {
  timeZone: "America/Argentina/Buenos_Aires",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

type ActivityListProps = { initial: ActivityPage; range: DayRange; today: string };

export function ActivityList({ initial, range, today }: ActivityListProps) {
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function loadMore() {
    if (!cursor) return;
    setLoading(true);
    setError(undefined);
    const result = await callApi(api.GET("/panel/activity", { params: { query: { ...range, cursor } } }));
    setLoading(false);
    if (!result.ok) return setError(result.message);
    setItems((current) => [...current, ...result.data.items]);
    setCursor(result.data.nextCursor);
  }

  if (items.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No hubo movimientos en este período.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {groupByDay(items).map((group) => (
        <section key={group.day} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">{dayLabel(group.day, today)}</h2>
          <ol className="flex flex-col divide-y rounded-xl border bg-card">
            {group.items.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <ActivityRow item={item} />
              </li>
            ))}
          </ol>
        </section>
      ))}
      <FormAlert message={error} />
      {cursor && (
        <Button variant="outline" size="lg" className="h-11" disabled={loading} onClick={loadMore}>
          {loading && <Spinner />}
          Ver más
        </Button>
      )}
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = icons[item.type];
  const isVoid = item.type === "STAMP_VOIDED" || item.type === "REDEMPTION_VOIDED";
  const detail = activityDetail(item);
  return (
    <Link
      href={panelCustomerRoute(item.customer.membershipId)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          item.type === "REDEMPTION" ? "bg-brand text-brand-foreground" : "bg-brand/15 text-primary",
          isVoid && "bg-destructive/10 text-destructive",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium text-primary">{customerName(item)}</span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {timeFormat.format(new Date(item.at))}
          </span>
        </span>
        <span className={cn("text-sm break-words", laterVoided(item) && "text-muted-foreground line-through")}>
          {activityTitle(item)}
        </span>
        {(detail || laterVoided(item)) && (
          <span className="text-xs break-words text-muted-foreground">
            {[laterVoided(item) && "Anulado después", detail].filter(Boolean).join(" · ")}
          </span>
        )}
        {item.customer.phone && <span className="text-xs text-muted-foreground">{item.customer.phone}</span>}
      </span>
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
