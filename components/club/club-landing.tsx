import { JoinFlow } from "@/components/join/join-flow";
import { brandStyle } from "@/lib/brand/colors";
import type { ClubPiece } from "@/lib/customer/types";
import { ClubIntro } from "./club-intro";

type ClubLandingProps = {
  piece: ClubPiece;
  pieceCode: string;
  customerName: string | null;
};

// Sumarse al club (diseño de la 12.5): la franja del color del comercio con "volver", el logo y el
// nombre, y una hoja blanca con el premio y los datos. Solo con el club abierto a nuevos clientes.
export function ClubLanding({ piece, pieceCode, customerName }: ClubLandingProps) {
  const { merchant, rewardRule } = piece;
  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-primary">
      <JoinFlow merchant={merchant} pieceCode={pieceCode} customerName={customerName} reward={rewardRule}>
        {rewardRule && <ClubIntro rewardRule={rewardRule} />}
      </JoinFlow>
    </main>
  );
}
