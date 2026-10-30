import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { MerchantList } from "@/components/admin/merchant-list";
import { MerchantStatusFilter } from "@/components/admin/merchant-status-filter";
import { Button } from "@/components/ui/button";
import { getMerchants } from "@/lib/admin/data";
import { adminRoutes } from "@/lib/admin/routes";
import { parseStatusFilter } from "@/lib/admin/status-filter";

export const metadata: Metadata = { title: "Comercios" };

export default function AdminMerchantsPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold text-primary">Comercios</h1>
          <p className="text-muted-foreground">Locales que usan Clubsy.</p>
        </div>
        <Button asChild className="h-10">
          <Link href={adminRoutes.newMerchant}>
            <PlusIcon />
            Nuevo comercio
          </Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingBlock />}>
        <Merchants searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Merchants({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const filter = parseStatusFilter((await searchParams).estado);
  const merchants = await getMerchants(filter);
  return (
    <div className="flex flex-col gap-4">
      <MerchantStatusFilter current={filter} />
      <MerchantList merchants={merchants} filter={filter} />
    </div>
  );
}
