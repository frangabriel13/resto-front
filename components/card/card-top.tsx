"use client";

import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { StampTicket } from "@/components/club/stamp-card-preview";
import { cardHeadline, cardTitle, carryOverMessage, filledStamps } from "@/lib/customer/card";
import type { MembershipCard } from "@/lib/customer/types";
import { cn } from "@/lib/utils";
import { StampQr } from "./stamp-qr";
import { useCardUpdates } from "./use-card-updates";

type Tab = "qr" | "card";

const tabs: { id: Tab; label: string }[] = [
  { id: "qr", label: "Mi QR" },
  { id: "card", label: "Mi tarjeta" },
];

// Lo de arriba de la tarjeta: el aviso en vivo, el selector entre el QR (lo que se usa en la caja,
// por eso arranca ahí) y el ticket con los sellos. Sin QR (club finalizado, o pausado con la tarjeta
// incompleta) se ve solo el ticket.
export function CardTop({ card, canShowQr }: { card: MembershipCard; canShowQr: boolean }) {
  const [tab, setTab] = useState<Tab>("qr");
  const message = useCardUpdates(card, canShowQr);
  const [shownMessage, setShownMessage] = useState(message);

  // Al llegar un sello o un canje, la tarjeta pasa a mostrar los sellos: es lo que acaba de cambiar.
  if (message !== shownMessage) {
    setShownMessage(message);
    if (message) setTab("card");
  }

  const { cycleRule, merchant } = card;
  const progress = { ...card, stampsRequired: cycleRule.stampsRequired };
  const filled = filledStamps(progress);
  const headline = cardHeadline(progress, {
    reward: cycleRule.rewardDescription,
    canShowQr,
    ended: merchant.status === "ENDED",
  });
  const carryOver = carryOverMessage(card);
  const showCard = !canShowQr || tab === "card";

  return (
    <div className="flex flex-col">
      {message && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2.5 rounded-[0.625rem] bg-ticket px-3.5 py-3 text-sm font-semibold text-ticket-foreground"
        >
          <CheckIcon aria-hidden strokeWidth={2.4} className="size-4.5 shrink-0" />
          {message}
        </p>
      )}

      {canShowQr && (
        <div
          role="group"
          aria-label="Qué mostrar"
          className="mb-4.5 flex gap-1 rounded-full bg-background p-1 shadow-[0_6px_24px_rgb(0_0_0/0.07),0_0_0_1px_rgb(0_0_0/0.04)]"
        >
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "h-11 flex-1 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                tab === id ? "bg-cta text-cta-foreground" : "text-neutral-700 hover:bg-neutral-100",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {canShowQr && tab === "qr" && <StampQr membershipId={card.id} forRedemption={card.canRedeem} />}

      {showCard && (
        <>
          <div className="mb-4 flex flex-col gap-1">
            <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">{headline.title}</h1>
            <p className="text-sm leading-normal text-neutral-600 wrap-anywhere">{headline.detail}</p>
          </div>
          <StampTicket
            stampsRequired={cycleRule.stampsRequired}
            filled={filled}
            showNext={merchant.status === "ACTIVE" && !card.canRedeem}
            prizeReady={card.canRedeem}
          >
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-base font-semibold">{cardTitle(card.cycle)}</span>
              <span className="text-[0.8125rem] text-ticket-foreground/82">
                {filled} de {cycleRule.stampsRequired}
              </span>
            </p>
          </StampTicket>
          {carryOver && !card.canRedeem && (
            <p className="mt-2.5 text-[0.8125rem] leading-normal text-neutral-600">{carryOver}</p>
          )}
        </>
      )}
    </div>
  );
}
