import { GiftIcon } from "lucide-react";
import { CustomerLogout } from "@/components/account/customer-logout";
import { LeaveClub } from "@/components/account/leave-club";
import { MarketingConsent } from "@/components/account/marketing-consent";
import { ClubNotice } from "@/components/club/club-notice";
import { ClubShell } from "@/components/club/club-shell";
import { ReviewLink } from "@/components/club/review-link";
import { StampGrid } from "@/components/rewards/stamp-grid";
import { cardTitle, carryOverMessage, filledStamps, progressMessage } from "@/lib/customer/card";
import { showConsentToggle } from "@/lib/customer/privacy";
import { showStampQr } from "@/lib/customer/stamp-qr";
import type { Customer, MembershipCard } from "@/lib/customer/types";
import { stampCount } from "@/lib/text";
import { CardHistory } from "./card-history";
import { CardLiveNotice } from "./card-live-notice";
import { StampQr } from "./stamp-qr";

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
  const showQr = showStampQr(merchant.status, card.canRedeem);
  const carryOver = carryOverMessage(card);

  return (
    <ClubShell merchant={merchant} footer={<CustomerLogout customerName={customer.name} />}>
      {notice && <ClubNotice>{notice}</ClubNotice>}
      <CardLiveNotice card={card} active={showQr} />

      <section aria-label="Tu tarjeta" className="flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold">{cardTitle(card.cycle)}</h2>
          <span className="text-sm opacity-80">
            {filled} de {cycleRule.stampsRequired}
          </span>
        </div>
        <StampGrid stampsRequired={cycleRule.stampsRequired} filled={filled} />
        <p className="font-medium">{progressMessage(progress)}</p>
        {carryOver && !card.canRedeem && <p className="text-sm opacity-80">{carryOver}</p>}
        {card.canRedeem && (
          <div className="flex items-start gap-3 rounded-xl bg-primary-foreground/10 p-4">
            <GiftIcon className="mt-0.5 size-6 shrink-0 text-brand" />
            <div className="flex flex-col gap-1">
              <span className="text-sm opacity-80">Tu premio</span>
              <span className="font-heading text-lg font-semibold break-words">{cycleRule.rewardDescription}</span>
              {showQr && <span className="text-sm opacity-80">Mostrá el QR de abajo en la caja para canjearlo.</span>}
            </div>
          </div>
        )}
      </section>

      {showQr && <StampQr membershipId={card.id} forRedemption={card.canRedeem} />}

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
          Tarjeta n.º {card.cycle} · {stampCount(card.totalStamps)} en
          total desde que te sumaste.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Movimientos</h2>
        <CardHistory entries={card.history} currentCycle={card.cycle} />
      </section>

      <ReviewLink url={merchant.googleReviewUrl} />

      <section className="flex flex-col gap-4 border-t pt-6">
        <h2 className="font-heading text-lg font-semibold">Tu participación</h2>
        {showConsentToggle(merchant.status, card.marketingConsent) && (
          <MarketingConsent membershipId={card.id} merchantName={merchant.name} initial={card.marketingConsent} />
        )}
        <LeaveClub membershipId={card.id} merchantName={merchant.name} />
      </section>
    </ClubShell>
  );
}
