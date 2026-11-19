import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AccountDetails } from "@/components/account/account-details";
import { AccountNotice } from "@/components/account/account-notice";
import { AccountShell } from "@/components/account/account-shell";
import { LoginFlow } from "@/components/account/login-flow";
import { MyClubs } from "@/components/account/my-clubs";
import { LoadingBlock } from "@/components/loading-block";
import { getCustomerSession } from "@/lib/customer/data";
import { accountNotice, customerRoutes, safeReturnPath } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Mi cuenta" };

export default function AccountPage({ searchParams }: PageProps<"/cuenta">) {
  return (
    <Suspense
      fallback={
        <AccountShell subtitle="Mi cuenta">
          <LoadingBlock />
        </AccountShell>
      }
    >
      <AccountContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AccountContent({ searchParams }: Pick<PageProps<"/cuenta">, "searchParams">) {
  const params = await searchParams;
  const returnTo = safeReturnPath(params.volver);
  const notice = accountNotice(params.aviso);
  const session = await getCustomerSession();

  if (!session) {
    return (
      <AccountShell subtitle="Tus clubes en un solo lugar">
        {notice && <AccountNotice>{notice}</AccountNotice>}
        <LoginFlow returnTo={returnTo ?? customerRoutes.account} />
        <div className="h-8" />
      </AccountShell>
    );
  }
  if (returnTo) redirect(returnTo);

  const { customer, memberships } = session;
  return (
    <AccountShell subtitle="Mi cuenta">
      {notice && <AccountNotice>{notice}</AccountNotice>}
      <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight wrap-anywhere">
        Hola, {customer.name}
      </h1>
      <p className="mt-1 mb-4.5 text-sm leading-normal text-neutral-600">
        {memberships.length > 0
          ? "Tocá un club para ver tu tarjeta y tu QR."
          : "Acá vas a ver tus tarjetas de todos los clubes."}
      </p>
      <MyClubs memberships={memberships} />
      <AccountDetails customer={customer} />
      <div className="h-6" />
    </AccountShell>
  );
}
