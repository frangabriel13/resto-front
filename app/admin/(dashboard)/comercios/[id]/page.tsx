import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { SectionCard } from "@/components/section-card";
import { BackLink } from "@/components/back-link";
import { ClubSettingsForm } from "@/components/admin/club-settings-form";
import { MerchantDataForm } from "@/components/admin/merchant-data-form";
import { MerchantStatusControl } from "@/components/admin/merchant-status-control";
import { NewPieceButton } from "@/components/admin/new-piece-button";
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

      <SectionCard
        title="Datos del comercio"
        description="La ficha comercial (contacto, Google y observaciones) solo la ve Clubsy."
      >
        <MerchantDataForm merchant={merchant} />
      </SectionCard>

      <SectionCard
        title="Piezas"
        description="Cada pieza tiene un chip NFC y un QR con su URL. Lleva al club o a Google, Instagram o WhatsApp, y el destino se cambia sin reprogramar el chip. Si se pierde o se rompe, desactivala."
      >
        <div className="flex flex-col gap-6">
          <NewPieceButton merchantId={merchant.id} merchantReviewUrl={merchant.googleReviewUrl} />
          {pieces.length > 0 && (
            <ul className="flex flex-col gap-3">
              {pieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  merchantId={merchant.id}
                  merchantSlug={merchant.slug}
                  merchantReviewUrl={merchant.googleReviewUrl}
                  piece={piece}
                  siteUrl={site}
                />
              ))}
            </ul>
          )}
        </div>
      </SectionCard>

      <section aria-labelledby="club" className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-1">
          <h2 id="club" className="font-heading text-xl font-semibold text-primary">
            Club de premios
          </h2>
          <p className="text-sm text-muted-foreground">
            Sellos y premio para sus clientes. Un comercio que solo usa carteles lo deja en
            preparación.
          </p>
        </div>

        <SectionCard title="Estado" description={statusHelp[merchant.status]}>
          <MerchantStatusControl merchantId={merchant.id} status={merchant.status} />
        </SectionCard>

        <SectionCard title="Tarjeta del cliente" description="Lo que ven los clientes del club.">
          <ClubSettingsForm merchant={merchant} />
        </SectionCard>

        <SectionCard
          title="Dueño"
          description="Entra al panel para configurar el premio y los empleados. Si es una persona nueva, se crea su usuario con una contraseña temporal."
        >
          <OwnerForm merchantId={merchant.id} />
        </SectionCard>
      </section>
    </div>
  );
}
