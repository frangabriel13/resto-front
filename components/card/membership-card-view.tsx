import { ClubNotice } from "@/components/club/club-notice";
import { ClubShell } from "@/components/club/club-shell";
import { ReviewLink } from "@/components/club/review-link";
import { StampGrid } from "@/components/rewards/stamp-grid";
import { filledStamps, progressMessage } from "@/lib/customer/card";
import type { Customer, MembershipCard } from "@/lib/customer/types";
import { CardHistory } from "./card-history";
import { CustomerLogout } from "@/components/account/customer-logout";

const statusNotices: Partial<Record<MembershipCard["merchant"]["status"], string>> = {
  PAUSED:
    "El club está pausado: por ahora no se suman sellos. Si completaste tu tarjeta, igual podés canjear tu premio.",
  ENDED: "Este club finalizó. Acá queda tu historial.",
};

export function MembershipCardView({ card, customer }: { card: MembershipCard; customer: Customer }) {
  const { merchant, cycleRule, nextCycleRule } = card;
  const progress = { ...card, stampsRequired: cycleRule.stampsRequired };
  const filled = filledStamps(progress);
  const notice = statusNotices[merchant.status];

  return (
    <ClubShell merchant={merchant} footer={<CustomerLogout customerName={customer.name} />}>
      {notice && <ClubNotice>{notice}</ClubNotice>}

      <section aria-label="Tu tarjeta" className="flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold">Tu tarjeta</h2>
          <span className="text-sm opacity-80">
            {filled} de {cycleRule.stampsRequired}
          </span>
        </div>
        <StampGrid stampsRequired={cycleRule.stampsRequired} filled={filled} />
        <p className="font-medium">{progressMessage(progress)}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">Tu premio</h2>
        <p>
          Con {cycleRule.stampsRequired} sellos:{" "}
          <span className="font-semibold">{cycleRule.rewardDescription}</span>
        </p>
        {cycleRule.conditions && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Condiciones: </span>
            {cycleRule.conditions}
          </p>
        )}
        {nextCycleRule && (
          <p className="text-sm text-muted-foreground">
            Desde tu próxima tarjeta el premio pasa a ser:{" "}
            <span className="font-medium text-foreground">
              {nextCycleRule.rewardDescription} con {nextCycleRule.stampsRequired} sellos
            </span>
            .
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Tarjeta n.º {card.cycle} · {card.totalStamps === 1 ? "1 sello" : `${card.totalStamps} sellos`} en
          total desde que te sumaste.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Movimientos</h2>
        <CardHistory entries={card.history} />
      </section>

      <ReviewLink url={merchant.googleReviewUrl} />
    </ClubShell>
  );
}
