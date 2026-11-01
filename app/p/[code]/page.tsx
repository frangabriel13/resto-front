import { SearchXIcon, TicketXIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ClubMessage } from "@/components/club/club-message";
import { ClubNotice } from "@/components/club/club-notice";
import { LoadingBlock } from "@/components/loading-block";
import { MerchantPageShell } from "@/components/merchant-page/merchant-page-shell";
import { PageMenu } from "@/components/merchant-page/page-menu";
import { getCustomerSession, getPublicPiece } from "@/lib/customer/data";
import { pageMenu, pageNotices } from "@/lib/customer/page-menu";

export const metadata: Metadata = { title: "Página del comercio" };

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
  // Los escaneos con destino externo los redirige `proxy.ts` con un 302; esto cubre las navegaciones internas.
  if (piece.state === "REDIRECT") redirect(piece.url);

  // Abrir la pieza nunca suma un sello: el socio ve el menú y desde ahí va a su tarjeta.
  const session = await getCustomerSession();
  const isMember = session?.memberships.some((m) => m.merchant.id === piece.merchant.id) ?? false;
  const notice = pageNotices[piece.state];

  return (
    <MerchantPageShell merchant={piece.merchant} socials={piece.page.socials}>
      {notice && <ClubNotice>{notice}</ClubNotice>}
      <PageMenu items={pageMenu(piece, code, { isMember, hasSession: session !== null })} />
    </MerchantPageShell>
  );
}
