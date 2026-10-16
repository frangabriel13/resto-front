import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CustomerLogout } from "@/components/account/customer-logout";
import { LoginFlow } from "@/components/account/login-flow";
import { MyClubs } from "@/components/account/my-clubs";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoadingBlock } from "@/components/loading-block";
import { getCustomerSession } from "@/lib/customer/data";
import { customerRoutes, safeReturnPath } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Mi cuenta" };

export default function AccountPage({ searchParams }: PageProps<"/cuenta">) {
  return (
    <AuthShell>
      <Suspense fallback={<LoadingBlock />}>
        <AccountContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function AccountContent({ searchParams }: Pick<PageProps<"/cuenta">, "searchParams">) {
  const returnTo = safeReturnPath((await searchParams).volver);
  const session = await getCustomerSession();

  if (!session) {
    return (
      <AuthCard
        title="Ingresá a tu cuenta"
        description="Con tu celular ves tus tarjetas de todos los clubes."
      >
        <LoginFlow returnTo={returnTo ?? customerRoutes.account} />
      </AuthCard>
    );
  }
  if (returnTo) redirect(returnTo);

  return (
    <div className="flex flex-col gap-6">
      <AuthCard title="Mis clubes" description="Tocá un club para ver tu tarjeta.">
        <MyClubs memberships={session.memberships} />
      </AuthCard>
      <CustomerLogout customerName={session.customer.name} />
    </div>
  );
}
