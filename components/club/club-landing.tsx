import Link from "next/link";
import { JoinClub } from "@/components/join/join-club";
import { StampPreview } from "@/components/rewards/stamp-preview";
import { Button } from "@/components/ui/button";
import { customerRoutes } from "@/lib/customer/routes";
import type { ClubPiece } from "@/lib/customer/types";
import { ClubNotice } from "./club-notice";
import { ClubShell } from "./club-shell";
import { ReviewLink } from "./review-link";

const stateNotices: Partial<Record<ClubPiece["state"], string>> = {
  PAUSED: "El club está pausado: por ahora no se suman sellos ni clientes nuevos.",
  ENDED: "Este club finalizó.",
};

type ClubLandingProps = {
  piece: ClubPiece;
  pieceCode: string;
  customerName: string | null;
};

export function ClubLanding({ piece, pieceCode, customerName }: ClubLandingProps) {
  const { merchant, rewardRule } = piece;
  const notice = stateNotices[piece.state];
  const ended = piece.state === "ENDED";

  return (
    <ClubShell merchant={merchant}>
      {notice && <ClubNotice>{notice}</ClubNotice>}

      {ended && !customerName && (
        <section className="flex flex-col gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Eras parte del club? Ingresá para ver tu historial.
          </p>
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href={customerRoutes.login(customerRoutes.card(merchant.slug))}>Ver mi historial</Link>
          </Button>
        </section>
      )}

      {rewardRule && !ended && (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold">Juntá sellos y llevate tu premio</h2>
          <StampPreview
            stampsRequired={rewardRule.stampsRequired}
            rewardDescription={rewardRule.rewardDescription}
          />
          <p className="text-sm text-muted-foreground">
            Sumás un sello por cada compra: mostrás tu tarjeta y el local lo confirma.
          </p>
          {rewardRule.conditions && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Condiciones: </span>
              {rewardRule.conditions}
            </p>
          )}
        </section>
      )}

      {piece.canJoin && (
        <section id="unirme" className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold">Sumate al club</h2>
          <JoinClub merchant={merchant} pieceCode={pieceCode} customerName={customerName} />
        </section>
      )}

      <ReviewLink url={merchant.googleReviewUrl} />
    </ClubShell>
  );
}
