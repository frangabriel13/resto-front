import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { NewMerchantForm } from "@/components/admin/new-merchant-form";
import { adminRoutes } from "@/lib/admin/routes";

export const metadata: Metadata = { title: "Nuevo comercio" };

export default function NewMerchantPage() {
  return (
    <div className="max-w-3xl">
      <BackLink href={adminRoutes.merchants}>Comercios</BackLink>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-primary">Nuevo comercio</h1>
      <NewMerchantForm />
    </div>
  );
}
