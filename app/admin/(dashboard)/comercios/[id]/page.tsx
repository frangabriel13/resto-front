import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { SectionCard } from "@/components/section-card";
import { BackLink } from "@/components/admin/back-link";
import { MerchantSettingsForm } from "@/components/admin/merchant-settings-form";
import { MerchantStatusControl } from "@/components/admin/merchant-status-control";
import { NewPieceForm } from "@/components/admin/new-piece-form";
import { OwnerForm } from "@/components/admin/owner-form";
import { PieceCard } from "@/components/admin/piece-card";
import { MerchantStatusBadge } from "@/components/merchants/merchant-status-badge";
import { getMerchantWithPieces } from "@/lib/admin/data";
import { adminRoutes } from "@/lib/admin/routes";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Comercio" };

const statusHelp = {
  DRAFT: "Para activarlo, el dueño tiene que configurar el premio desde su panel.",
  ACTIVE: "Recibe clientes y suma sellos.",
  PAUSED: "Los clientes ven su tarjeta en solo lectura. Solo se pueden canjear tarjetas completas.",
  ENDED: "Los clientes ven su historial. El panel queda en solo lectura.",
} as const;

export default function AdminMerchantPage({ params }: PageProps<"/admin/comercios/[id]">) {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <BackLink href={adminRoutes.merchants}>Comercios</BackLink>
        <Suspense fallback={<LoadingBlock />}>
          <MerchantDetail params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function MerchantDetail({ params }: Pick<PageProps<"/admin/comercios/[id]">, "params">) {
  const { id } = await params;
  const { merchant, pieces } = await getMerchantWithPieces(id);
  const site = siteUrl();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold break-words text-primary">
            {merchant.name}
          </h1>
          <MerchantStatusBadge status={merchant.status} />
        </div>
      </div>

      <SectionCard title="Estado" description={statusHelp[merchant.status]}>
        <MerchantStatusControl merchantId={merchant.id} status={merchant.status} />
      </SectionCard>

      <SectionCard title="Datos y marca" description="Lo que ven los clientes en la tarjeta.">
        <MerchantSettingsForm merchant={merchant} />
      </SectionCard>

      <SectionCard
        title="Piezas"
        description="Cada pieza tiene un chip NFC y un QR con su URL. Si se pierde o se rompe, desactivala."
      >
        <div className="flex flex-col gap-6">
          <NewPieceForm merchantId={merchant.id} />
          {pieces.length > 0 && (
            <ul className="flex flex-col gap-3">
              {pieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  merchantId={merchant.id}
                  merchantSlug={merchant.slug}
                  piece={piece}
                  siteUrl={site}
                />
              ))}
            </ul>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Dueño"
        description="Si es una persona nueva, se crea su usuario con una contraseña temporal."
      >
        <OwnerForm merchantId={merchant.id} />
      </SectionCard>
    </div>
  );
}
