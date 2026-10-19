import { GiftIcon, StampIcon } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { cycleLabel, entryLabel, groupByCycle } from "@/lib/customer/history";
import type { CardHistoryEntry } from "@/lib/customer/types";
import { cn } from "@/lib/utils";

export function CardHistory({ entries, currentCycle }: { entries: CardHistoryEntry[]; currentCycle: number }) {
  const groups = groupByCycle(entries, currentCycle);
  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tenés movimientos.</p>;
  }
  // Con una sola tarjeta (la primera) no hace falta separar.
  const showLabels = groups.length > 1 || currentCycle > 1;

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.cycle} className="flex flex-col gap-2">
          {showLabels && (
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{cycleLabel(group)}</h3>
          )}
          <ol className="flex flex-col divide-y">
            {group.entries.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

function HistoryRow({ entry }: { entry: CardHistoryEntry }) {
  const isRedemption = entry.type === "REDEMPTION";
  const Icon = isRedemption ? GiftIcon : StampIcon;
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isRedemption ? "bg-brand text-brand-foreground" : "bg-brand/15 text-primary",
          entry.voided && "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span
          className={cn(
            "text-sm break-words",
            isRedemption ? "font-semibold" : "font-medium",
            entry.voided && "font-medium text-muted-foreground line-through",
          )}
        >
          {entryLabel(entry)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(entry.at)}
          {entry.voided && " · anulado"}
        </span>
      </div>
    </li>
  );
}
