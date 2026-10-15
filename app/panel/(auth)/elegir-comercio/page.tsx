import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { AuthCard } from "@/components/auth/auth-card";
import { MerchantPicker } from "@/components/staff/merchant-picker";
import { staffRoutes } from "@/lib/staff/routes";
import { ensureStaffRoute } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Elegir comercio" };

export default function SelectMerchantPage() {
  return (
    <AuthCard
      title="¿Con qué comercio vas a trabajar?"
      description="Podés cambiarlo cuando quieras desde el panel."
    >
      <Suspense fallback={<LoadingBlock />}>
        <SelectMerchantGate />
      </Suspense>
    </AuthCard>
  );
}

async function SelectMerchantGate() {
  const account = await ensureStaffRoute(staffRoutes.selectMerchant);
  return <MerchantPicker account={account} />;
}
