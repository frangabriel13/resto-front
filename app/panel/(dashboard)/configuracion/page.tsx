import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { PageHeader } from "@/components/panel/page-header";
import { SectionCard } from "@/components/section-card";
import { MerchantFacts } from "@/components/settings/merchant-facts";
import { SettingsForm } from "@/components/settings/settings-form";
import { getSettings } from "@/lib/settings/data";
import { requireOwnerSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Configuración" };

export default function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader title="Configuración" description="Colores, link de reseñas y tiempo entre sellos." />
      <Suspense fallback={<LoadingBlock />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}

async function SettingsContent() {
  const { merchant } = await requireOwnerSession();
  const view = await getSettings();
  const readOnly = merchant.status === "PAUSED" || merchant.status === "ENDED";

  return (
    <>
      <SectionCard title="Tu comercio" description="Estos datos los maneja Clubsy. Si hay que cambiarlos, escribinos.">
        <MerchantFacts merchant={view.merchant} />
      </SectionCard>
      <SectionCard
        title="Tu club"
        description={
          readOnly
            ? "Con el club pausado o finalizado, la configuración no se puede cambiar."
            : "Así lo ven tus clientes."
        }
      >
        <SettingsForm view={view} readOnly={readOnly} />
      </SectionCard>
    </>
  );
}
