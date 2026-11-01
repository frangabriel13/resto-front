import { BackLink } from "@/components/back-link";
import { JoinClub } from "@/components/join/join-club";
import { StampPreview } from "@/components/rewards/stamp-preview";
import { customerRoutes } from "@/lib/customer/routes";
import type { ClubPiece } from "@/lib/customer/types";
import { ClubShell } from "./club-shell";

type ClubLandingProps = {
  piece: ClubPiece;
  pieceCode: string;
  customerName: string | null;
};

// El premio, las condiciones y el alta; solo con el club abierto a nuevos clientes.
export function ClubLanding({ piece, pieceCode, customerName }: ClubLandingProps) {
  const { merchant, rewardRule } = piece;

  return (
    <ClubShell merchant={merchant}>
      <div className="-mb-4">
        <BackLink href={customerRoutes.piece(pieceCode)}>Volver</BackLink>
      </div>

      {rewardRule && (
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

      <section id="unirme" className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Sumate al club</h2>
        <JoinClub merchant={merchant} pieceCode={pieceCode} customerName={customerName} />
      </section>
    </ClubShell>
  );
}
