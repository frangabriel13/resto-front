import { CheckIcon, GiftIcon } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { cycleLabel, entryLabel, groupByCycle } from "@/lib/customer/history";
import type { CardHistoryEntry } from "@/lib/customer/types";
import { cn } from "@/lib/utils";

export function CardHistory({ entries, currentCycle }: { entries: CardHistoryEntry[]; currentCycle: number }) {
  const groups = groupByCycle(entries, currentCycle);
  if (groups.length === 0) {
    return (
      <p className="text-[0.8125rem] leading-normal text-muted-foreground">
        Todavía no tenés movimientos. Tu primer sello llega con tu próxima compra.
      </p>
    );
  }
  // Con una sola tarjeta (la primera) no hace falta separar.
  const showLabels = groups.length > 1 || currentCycle > 1;

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <section key={group.cycle} className="flex flex-col">
          {showLabels && <h3 className="mb-0.5 text-xs font-semibold text-muted-foreground">{cycleLabel(group)}</h3>}
          <ol className="flex flex-col">
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
  const Icon = isRedemption ? GiftIcon : CheckIcon;
  return (
    <li className="flex min-h-13 items-center gap-3 border-t border-neutral-100 py-2 first:border-t-0">
      <span
        className={cn(
          "flex size-8.5 shrink-0 items-center justify-center rounded-full",
          entry.voided
            ? "bg-neutral-100 text-muted-foreground"
            : isRedemption
              ? "bg-ticket-prize text-ticket-prize-foreground"
              : "bg-ink/8 text-ink",
        )}
      >
        <Icon aria-hidden strokeWidth={isRedemption ? 1.8 : 2.2} className="size-4" />
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
