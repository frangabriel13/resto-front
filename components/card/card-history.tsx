import { GiftIcon, StampIcon } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { CardHistoryEntry } from "@/lib/customer/types";
import { cn } from "@/lib/utils";

export function CardHistory({ entries }: { entries: CardHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tenés movimientos.</p>;
  }

  return (
    <ol className="flex flex-col divide-y">
      {entries.map((entry) => {
        const Icon = entry.type === "REDEMPTION" ? GiftIcon : StampIcon;
        const label =
          entry.type === "REDEMPTION" ? `Premio canjeado: ${entry.rewardDescription}` : "Sello";
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
            <div className="flex min-w-0 flex-col">
              <span className={cn("text-sm font-medium", entry.voided && "text-muted-foreground line-through")}>
                {label}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(entry.at)}
                {entry.voided && " · anulado"}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
