import { SearchXIcon, StoreIcon, TicketXIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ClubLanding } from "@/components/club/club-landing";
import { ClubMessage } from "@/components/club/club-message";
import { LoadingBlock } from "@/components/loading-block";
import { getCustomerSession, getPublicPiece } from "@/lib/customer/data";
import { customerRoutes } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Club de beneficios" };

export default function PiecePage({ params }: PageProps<"/p/[code]">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PieceContent params={params} />
    </Suspense>
  );
}

async function PieceContent({ params }: Pick<PageProps<"/p/[code]">, "params">) {
  const { code } = await params;
  const piece = await getPublicPiece(code);

  if (!piece) {
    return (
      <ClubMessage
        icon={SearchXIcon}
        title="No encontramos este código"
        text="Revisá que hayas escaneado el código del local."
      />
    );
  }
  if (piece.state === "PIECE_INACTIVE") {
    return (
      <ClubMessage
        icon={TicketXIcon}
        title="Este código ya no está activo"
        text="Pedile al local el código nuevo."
      />
    );
  }
  if (piece.state === "CLUB_NOT_OPEN") {
    return (
      <ClubMessage
        icon={StoreIcon}
        title="Este club todavía no abrió"
        text="Volvé a escanear el código en unos días."
      />
    );
  }

  // Abrir la pieza nunca suma un sello: solo lleva al cliente a su tarjeta.
  const session = await getCustomerSession();
  if (session?.memberships.some((m) => m.merchant.id === piece.merchant.id)) {
    redirect(customerRoutes.card(piece.merchant.slug));
  }
  return (
    <ClubLanding piece={piece} pieceCode={code} customerName={session?.customer.name ?? null} />
  );
}
