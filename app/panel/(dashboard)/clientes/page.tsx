import type { Metadata } from "next";
import { CustomerSearch } from "@/components/customers/customer-search";
import { PageHeader } from "@/components/panel/page-header";

export const metadata: Metadata = { title: "Clientes" };

export default function CustomersPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      <PageHeader title="Clientes" description="Buscá por nombre o teléfono para ver su tarjeta." />
      <CustomerSearch />
    </div>
  );
}
