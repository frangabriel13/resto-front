import type { MembershipCard } from "@/lib/customer/types";
import { stampCount } from "@/lib/text";

// El premio de esta tarjeta, sus condiciones y, si el dueño lo cambió, el de la próxima.
export function CardPrize({ card }: { card: MembershipCard }) {
  const { cycleRule, nextCycleRule } = card;
  return (
    <section aria-labelledby="tu-premio" className="flex flex-col gap-2.5">
      <h2 id="tu-premio" className="text-[1.0625rem] font-semibold">
        Tu premio
      </h2>
      <p className="text-sm leading-normal">
        Con {stampCount(cycleRule.stampsRequired)}:{" "}
        <span className="font-semibold wrap-anywhere">{cycleRule.rewardDescription}</span>
      </p>
      {cycleRule.conditions && (
        <p className="rounded-[0.625rem] bg-neutral-100 px-3.5 py-3 text-[0.8125rem] leading-normal whitespace-pre-line text-neutral-600 wrap-anywhere">
          <span className="font-semibold text-foreground">Condiciones: </span>
          {cycleRule.conditions}
        </p>
      )}
      {nextCycleRule && (
        <p className="rounded-[0.625rem] bg-ink/8 px-3.5 py-3 text-[0.8125rem] leading-normal text-neutral-700 wrap-anywhere">
          <span className="font-semibold text-ink">Desde tu próxima tarjeta</span>, el premio pasa a ser{" "}
          {nextCycleRule.rewardDescription} con {stampCount(nextCycleRule.stampsRequired)}. Esta tarjeta sigue igual.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Tarjeta n.º {card.cycle} · {stampCount(card.totalStamps)} en total desde que te sumaste.
      </p>
    </section>
  );
}
