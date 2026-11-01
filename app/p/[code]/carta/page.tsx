import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { MenuScreen } from "@/components/merchant-page/menu-screen";
import { MerchantPageShell } from "@/components/merchant-page/merchant-page-shell";
import { getPublicPiece } from "@/lib/customer/data";
import { customerRoutes } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Carta" };

export default function PieceMenuPage({ params }: PageProps<"/p/[code]/carta">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PieceMenuContent params={params} />
    </Suspense>
  );
}

async function PieceMenuContent({ params }: Pick<PageProps<"/p/[code]/carta">, "params">) {
  const { code } = await params;
  const piece = await getPublicPiece(code);
  // Sin ítems visibles (por ejemplo, los ocultaron con la pantalla abierta), vuelve al menú.
  if (!piece || !("merchant" in piece) || !piece.menu) redirect(customerRoutes.piece(code));

  return (
    <MerchantPageShell merchant={piece.merchant} socials={piece.page.socials} showCover={false}>
      <MenuScreen menu={piece.menu} pieceCode={code} />
    </MerchantPageShell>
  );
}
