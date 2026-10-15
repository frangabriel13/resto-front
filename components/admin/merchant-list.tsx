import { ChevronRightIcon, StoreIcon } from "lucide-react";
import Link from "next/link";
import { MerchantStatusBadge } from "@/components/merchants/merchant-status-badge";
import type { MerchantSummary } from "@/lib/admin/types";
import { adminRoutes } from "@/lib/admin/routes";

export function MerchantList({ merchants }: { merchants: MerchantSummary[] }) {
  if (merchants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <StoreIcon className="size-8 text-brand" />
        <p className="font-medium">Todavía no hay comercios</p>
        <p className="text-sm text-muted-foreground">Creá el primero para empezar.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {merchants.map((merchant) => (
        <li key={merchant.id}>
          <Link
            href={adminRoutes.merchant(merchant.id)}
            className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium break-words text-primary">{merchant.name}</span>
                <MerchantStatusBadge status={merchant.status} />
              </div>
              <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-mono">{merchant.slug}</span>
                <span>{merchant.hasActiveRule ? "Premio configurado" : "Sin premio"}</span>
                <span>
                  {merchant.activeOwners === 1 ? "1 dueño" : `${merchant.activeOwners} dueños`}
                </span>
              </span>
            </div>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
