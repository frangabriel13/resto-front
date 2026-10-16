import { ChevronRightIcon, StoreIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { brandStyle } from "@/lib/brand/colors";
import { merchantStatusLabels } from "@/lib/merchants/status";
import { customerRoutes } from "@/lib/customer/routes";
import type { MembershipSummary } from "@/lib/customer/types";
import { initials } from "@/lib/text";

export function MyClubs({ memberships }: { memberships: MembershipSummary[] }) {
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <StoreIcon className="size-8 text-brand" />
        <p className="font-medium">Todavía no estás en ningún club</p>
        <p className="text-sm text-muted-foreground">Escaneá el código de un local para sumarte.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {memberships.map(({ id, merchant, balance, stampsRequired, canRedeem }) => (
        <li key={id}>
          <Link
            href={customerRoutes.card(merchant.slug)}
            className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3 transition-colors hover:bg-muted"
          >
            <span
              style={brandStyle(merchant)}
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground"
            >
              {initials(merchant.name)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-medium break-words text-primary">{merchant.name}</span>
              <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {canRedeem ? (
                  <span className="font-medium text-brand">¡Premio listo!</span>
                ) : (
                  `${balance} de ${stampsRequired} sellos`
                )}
                {(merchant.status === "PAUSED" || merchant.status === "ENDED") && (
                  <Badge variant="secondary">{merchantStatusLabels[merchant.status]}</Badge>
                )}
              </span>
            </span>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
