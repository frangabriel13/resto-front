import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { MerchantPageShell } from "@/components/merchant-page/merchant-page-shell";
import { WifiScreen } from "@/components/merchant-page/wifi-screen";
import { getPublicPiece } from "@/lib/customer/data";
import { customerRoutes } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Wi-Fi" };

export default function PieceWifiPage({ params }: PageProps<"/p/[code]/wifi">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PieceWifiContent params={params} />
    </Suspense>
  );
}

async function PieceWifiContent({ params }: Pick<PageProps<"/p/[code]/wifi">, "params">) {
  const { code } = await params;
  const piece = await getPublicPiece(code);
  if (!piece || !("merchant" in piece) || !piece.page.wifi) redirect(customerRoutes.piece(code));

  return (
    <MerchantPageShell merchant={piece.merchant} socials={piece.page.socials} showCover={false}>
      <WifiScreen wifi={piece.page.wifi} pieceCode={code} />
    </MerchantPageShell>
  );
}
