import { GiftIcon, StampIcon } from "lucide-react";
import { historyActor, historyTitle, voidedText } from "@/lib/customers/history";
import type { CustomerHistoryEntry } from "@/lib/customers/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { VoidStamp } from "./void-stamp";

export function CustomerHistory({ entries }: { entries: CustomerHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tiene movimientos.</p>;
  }
  return (
    <ol className="flex flex-col divide-y">
      {entries.map((entry) => {
        const Icon = entry.type === "REDEMPTION" ? GiftIcon : StampIcon;
        return (
          <li key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-primary",
                entry.voided && "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className={cn("text-sm font-medium", entry.voided && "text-muted-foreground line-through")}>
                {historyTitle(entry)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(entry.at)} · {historyActor(entry)}
              </span>
              {entry.voided && <span className="text-xs text-destructive">{voidedText(entry.voided)}</span>}
            </div>
            {entry.type === "STAMP" && entry.canVoid && <VoidStamp stampId={entry.id} />}
          </li>
        );
      })}
    </ol>
  );
}
