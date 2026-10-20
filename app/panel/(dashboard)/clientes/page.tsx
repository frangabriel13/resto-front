import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerSearch } from "@/components/customers/customer-search";
import { ExportCustomers } from "@/components/customers/export-customers";
import { PageHeader } from "@/components/panel/page-header";
import { SectionCard } from "@/components/section-card";
import { requirePanelSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Clientes" };

export default function CustomersPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-col">
        <PageHeader title="Clientes" description="Buscá por nombre o teléfono para ver su tarjeta." />
        <CustomerSearch />
      </div>
      <Suspense fallback={null}>
        <OwnerExport />
      </Suspense>
    </div>
  );
}

async function OwnerExport() {
  const { merchant } = await requirePanelSession();
  if (merchant.role !== "OWNER") return null;
  return (
    <SectionCard title="Exportar">
      <ExportCustomers />
    </SectionCard>
  );
}
