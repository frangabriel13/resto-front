import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { CustomerHistory } from "@/components/customers/customer-history";
import { ManualStamp } from "@/components/customers/manual-stamp";
import { LoadingBlock } from "@/components/loading-block";
import { StampGrid } from "@/components/rewards/stamp-grid";
import { SectionCard } from "@/components/section-card";
import { getCustomerDetail } from "@/lib/customers/data";
import { formatDate } from "@/lib/format";
import { panelRoutes } from "@/lib/staff/routes";
import { requirePanelSession } from "@/lib/staff/session";
import { stampCount } from "@/lib/text";

export const metadata: Metadata = { title: "Cliente" };

export default function CustomerPage({ params }: PageProps<"/panel/clientes/[id]">) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      <BackLink href={panelRoutes.customers}>Clientes</BackLink>
      <Suspense fallback={<LoadingBlock />}>
        <CustomerContent params={params} />
      </Suspense>
    </div>
  );
}

async function CustomerContent({ params }: Pick<PageProps<"/panel/clientes/[id]">, "params">) {
  const { id } = await params;
  const [{ merchant }, detail] = await Promise.all([requirePanelSession(), getCustomerDetail(id)]);
  const { membership } = detail;
  const canStamp = merchant.status === "ACTIVE" && !detail.leftAt;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold break-words text-primary">
          {membership.customer.name ?? "Cliente sin nombre"}
        </h1>
        {membership.customer.phone && <p className="text-muted-foreground">{membership.customer.phone}</p>}
        <p className="text-sm text-muted-foreground">
          {detail.leftAt
            ? `Salió del club el ${formatDate(detail.leftAt)}.`
            : `En el club desde el ${formatDate(detail.joinedAt)}.`}{" "}
          {detail.marketingConsent ? "Acepta recibir novedades." : "No recibe novedades."}
        </p>
      </div>

      <section
        aria-label="Su tarjeta"
        className="flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground"
      >
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold">Tarjeta n.º {membership.cycle}</h2>
          <span className="text-sm opacity-80">
            {Math.min(membership.balance, membership.stampsRequired)} de {membership.stampsRequired}
          </span>
        </div>
        <StampGrid
          stampsRequired={membership.stampsRequired}
          filled={Math.min(membership.balance, membership.stampsRequired)}
        />
        {membership.canRedeem && (
          <p>
            <span className="font-medium">¡Ya puede canjear su premio!</span>{" "}
            <span className="opacity-80">Para canjear, escaneá el QR de su tarjeta.</span>
          </p>
        )}
      </section>

      {canStamp && <ManualStamp detail={detail} />}

      <SectionCard title="Movimientos" description={`${stampCount(membership.totalStamps)} en total.`}>
        <CustomerHistory
          entries={detail.history}
          currentCycle={membership.cycle}
          isOwner={merchant.role === "OWNER"}
          readOnly={merchant.status === "ENDED"}
        />
      </SectionCard>
    </div>
  );
}
