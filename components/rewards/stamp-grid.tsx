import { CheckIcon, GiftIcon } from "lucide-react";
import { stampColumns } from "@/lib/rewards/layout";
import { cn } from "@/lib/utils";

// Un casillero por sello; el último es el premio. Pensado para ir sobre fondo `primary`.
export function StampGrid({ stampsRequired, filled = 0 }: { stampsRequired: number; filled?: number }) {
  return (
    <ol
      aria-label={`Tarjeta de ${stampsRequired} sellos, ${filled} ${filled === 1 ? "sellado" : "sellados"}`}
      className="grid w-fit gap-2"
      style={{ gridTemplateColumns: `repeat(${stampColumns(stampsRequired)}, 2.25rem)` }}
    >
      {Array.from({ length: stampsRequired }, (_, i) => {
        const isFilled = i < filled;
        const isReward = i === stampsRequired - 1;
        return (
          <li
            key={i}
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-xs",
              isFilled
                ? "bg-brand text-brand-foreground"
                : isReward
                  ? "bg-brand/30 text-primary-foreground"
                  : "border-2 border-dashed border-primary-foreground/40 text-primary-foreground/60",
            )}
          >
            {isReward ? (
              <GiftIcon className="size-4" />
            ) : isFilled ? (
              <CheckIcon className="size-4" />
            ) : (
              i + 1
            )}
          </li>
        );
      })}
    </ol>
  );
}
