import type { Metadata } from "next";
import { SectionCard } from "@/components/section-card";
import { BackLink } from "@/components/admin/back-link";
import { NewMerchantForm } from "@/components/admin/new-merchant-form";
import { adminRoutes } from "@/lib/admin/routes";

export const metadata: Metadata = { title: "Nuevo comercio" };

export default function NewMerchantPage() {
  return (
    <div className="max-w-lg">
      <BackLink href={adminRoutes.merchants}>Comercios</BackLink>
      <SectionCard
        title="Nuevo comercio"
        description="Arranca en preparación. Después cargás su marca, sus piezas y su dueño."
      >
        <NewMerchantForm />
      </SectionCard>
    </div>
  );
}
