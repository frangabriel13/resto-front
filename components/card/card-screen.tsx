import { UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { CustomerLogout } from "@/components/account/customer-logout";
import { LeaveClub } from "@/components/account/leave-club";
import { MarketingConsent } from "@/components/account/marketing-consent";
import { MerchantIdentity } from "@/components/club/merchant-identity";
import { ClubsyCredit } from "@/components/merchant-page/clubsy-credit";
import { roundBackClass } from "@/components/merchant-page/round-back-link";
import { brandStyle } from "@/lib/brand/colors";
import { showConsentToggle } from "@/lib/customer/privacy";
import { customerRoutes } from "@/lib/customer/routes";
import { showStampQr } from "@/lib/customer/stamp-qr";
import type { Customer, MembershipCard } from "@/lib/customer/types";
import { CardHistory } from "./card-history";
import { CardPrize } from "./card-prize";
import { CardTop } from "./card-top";
import { ReviewRow } from "./review-row";

const statusNotices: Partial<Record<MembershipCard["merchant"]["status"], string>> = {
  PAUSED:
    "El club está pausado: por ahora no se suman sellos. Si completaste tu tarjeta, igual podés canjear tu premio.",
  ENDED: "Este club finalizó. Acá queda tu historial.",
};

// La tarjeta del cliente (diseño de la 12.6): la franja del comercio con su logo y "Mi cuenta", y una
// hoja blanca con el selector entre el QR y los sellos, el premio, los movimientos y su participación.
export function CardScreen({ card, customer }: { card: MembershipCard; customer: Customer }) {
  const { merchant } = card;
  const notice = statusNotices[merchant.status];

  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-primary">
      <header>
        <div className="mx-auto flex w-full max-w-md items-center gap-3 p-4">
          <MerchantIdentity merchant={merchant} />
          <Link href={customerRoutes.account} aria-label="Mi cuenta" className={roundBackClass}>
            <UserRoundIcon aria-hidden className="size-4.5" />
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col rounded-t-[1.625rem] bg-background">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-5 pb-7">
          {notice && (
            <p role="status" className="mb-4 rounded-[0.625rem] bg-neutral-100 px-3.5 py-3 text-[0.8125rem] leading-normal text-neutral-700">
              {notice}
            </p>
          )}
          <CardTop card={card} canShowQr={showStampQr(merchant.status, card.canRedeem)} />

          <div className="mt-6.5">
            <CardPrize card={card} />
          </div>

          <section aria-labelledby="movimientos" className="mt-6.5 flex flex-col gap-1.5">
            <h2 id="movimientos" className="text-[1.0625rem] font-semibold">
              Movimientos
            </h2>
            <CardHistory entries={card.history} currentCycle={card.cycle} />
          </section>

          {merchant.googleReviewUrl && (
            <div className="mt-5">
              <ReviewRow url={merchant.googleReviewUrl} />
            </div>
          )}

          <section aria-labelledby="tu-participacion" className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-5">
            <h2 id="tu-participacion" className="text-[1.0625rem] font-semibold">
              Tu participación
            </h2>
            {showConsentToggle(merchant.status, card.marketingConsent) && (
              <MarketingConsent membershipId={card.id} merchantName={merchant.name} initial={card.marketingConsent} />
            )}
            <LeaveClub membershipId={card.id} merchantName={merchant.name} />
          </section>

          <footer className="mt-auto flex flex-col items-center gap-3 border-t border-neutral-100 pt-4">
            <CustomerLogout customerName={customer.name} />
            <ClubsyCredit />
          </footer>
        </div>
      </div>
    </main>
  );
}
