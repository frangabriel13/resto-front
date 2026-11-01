import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ClubLanding } from "@/components/club/club-landing";
import { LoadingBlock } from "@/components/loading-block";
import { getCustomerSession, getPublicPiece } from "@/lib/customer/data";
import { customerRoutes } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Sumate al club" };

export default function PieceClubPage({ params }: PageProps<"/p/[code]/club">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PieceClubContent params={params} />
    </Suspense>
  );
}

async function PieceClubContent({ params }: Pick<PageProps<"/p/[code]/club">, "params">) {
  const { code } = await params;
  const piece = await getPublicPiece(code);
  // Sin alta posible (por ejemplo, el club se pausó con la pantalla abierta), vuelve al menú.
  if (!piece || !("merchant" in piece) || !piece.canJoin) redirect(customerRoutes.piece(code));

  const session = await getCustomerSession();
  if (session?.memberships.some((m) => m.merchant.id === piece.merchant.id)) {
    redirect(customerRoutes.card(piece.merchant.slug));
  }
  return <ClubLanding piece={piece} pieceCode={code} customerName={session?.customer.name ?? null} />;
}
