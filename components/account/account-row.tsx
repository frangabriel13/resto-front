import type { LucideIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Una fila de "Tu cuenta": el ícono en un círculo, el texto y un detalle en gris.
export function AccountRowContent({
  icon: Icon,
  label,
  detail,
  danger = false,
  chevron = false,
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
  danger?: boolean;
  chevron?: boolean;
}) {
  return (
    <>
      <span
        className={cn(
          "flex size-10.5 shrink-0 items-center justify-center rounded-full",
          danger ? "bg-destructive/8 text-destructive" : "bg-ink/8 text-ink",
        )}
      >
        <Icon aria-hidden strokeWidth={1.7} className="size-4.75" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className={cn("text-sm font-medium", danger && "text-destructive")}>{label}</span>
        <span className="text-[0.8125rem] text-muted-foreground">{detail}</span>
      </span>
      {chevron && <ChevronRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />}
    </>
  );
}

export const accountRowButtonClass =
  "-mx-2 flex min-h-14.5 w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 transition-colors outline-none hover:bg-neutral-50 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-neutral-100 disabled:opacity-60";
