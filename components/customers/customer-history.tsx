import { GiftIcon, StampIcon } from "lucide-react";
import { historyActor, historyTitle, redemptionVoidHint, voidedText } from "@/lib/customers/history";
import type { CustomerHistoryEntry } from "@/lib/customers/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { VoidEntry } from "./void-entry";

type CustomerHistoryProps = {
  entries: CustomerHistoryEntry[];
  currentCycle: number;
  isOwner: boolean;
  // Con el club finalizado no se anula nada.
  readOnly: boolean;
};

export function CustomerHistory({ entries, currentCycle, isOwner, readOnly }: CustomerHistoryProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tiene movimientos.</p>;
  }
  return (
    <ol className="flex flex-col divide-y">
      {entries.map((entry) => {
        const isRedemption = entry.type === "REDEMPTION";
        const Icon = isRedemption ? GiftIcon : StampIcon;
        const hint = readOnly ? null : redemptionVoidHint(entry, { currentCycle, isOwner, history: entries });
        return (
          <li key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                isRedemption ? "bg-brand text-brand-foreground" : "bg-brand/15 text-primary",
                entry.voided && "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className={cn(
                  "text-sm break-words",
                  isRedemption ? "font-semibold" : "font-medium",
                  entry.voided && "font-medium text-muted-foreground line-through",
                )}
              >
                {historyTitle(entry)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(entry.at)} · {historyActor(entry)}
              </span>
              {entry.voided && <span className="text-xs text-destructive">{voidedText(entry.voided)}</span>}
              {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
            </div>
            {entry.canVoid && !readOnly && <VoidEntry entry={entry} />}
          </li>
        );
      })}
    </ol>
  );
}
