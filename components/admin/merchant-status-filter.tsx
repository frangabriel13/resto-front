import Link from "next/link";
import { Button } from "@/components/ui/button";
import { statusFilterHref, statusFilters, type MerchantFilter } from "@/lib/admin/status-filter";

const options = [{ filter: null, label: "Todos" }, ...statusFilters];

export function MerchantStatusFilter({ current }: { current: MerchantFilter | null }) {
  return (
    <nav aria-label="Filtrar comercios" className="flex flex-wrap gap-2">
      {options.map(({ filter, label }) => (
        <Button
          key={label}
          asChild
          size="sm"
          variant={current === filter ? "default" : "outline"}
          className="h-9 rounded-full"
        >
          <Link href={statusFilterHref(filter)} aria-current={current === filter ? "true" : undefined}>
            {label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
