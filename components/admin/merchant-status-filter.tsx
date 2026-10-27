import Link from "next/link";
import { Button } from "@/components/ui/button";
import { statusFilterHref, statusFilters } from "@/lib/admin/status-filter";
import type { MerchantStatus } from "@/lib/merchants/status";

const options = [{ status: null, label: "Todos" }, ...statusFilters];

export function MerchantStatusFilter({ current }: { current: MerchantStatus | null }) {
  return (
    <nav aria-label="Filtrar por estado del club" className="flex flex-wrap gap-2">
      {options.map(({ status, label }) => (
        <Button
          key={label}
          asChild
          size="sm"
          variant={current === status ? "default" : "outline"}
          className="h-9 rounded-full"
        >
          <Link href={statusFilterHref(status)} aria-current={current === status ? "true" : undefined}>
            {label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
