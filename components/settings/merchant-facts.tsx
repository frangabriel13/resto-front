import Image from "next/image";
import { initials } from "@/lib/text";
import { merchantStatusLabels } from "@/lib/merchants/status";
import type { SettingsView } from "@/lib/settings/types";

export function MerchantFacts({ merchant }: { merchant: SettingsView["merchant"] }) {
  return (
    <div className="flex items-center gap-4">
      {merchant.logoUrl ? (
        <Image
          src={merchant.logoUrl}
          alt={`Logo de ${merchant.name}`}
          width={56}
          height={56}
          unoptimized
          className="size-14 rounded-xl border object-contain p-1"
        />
      ) : (
        <span className="flex size-14 items-center justify-center rounded-xl bg-muted text-lg font-semibold text-primary">
          {initials(merchant.name)}
        </span>
      )}
      <dl className="flex min-w-0 flex-col gap-0.5 text-sm">
        <dt className="sr-only">Nombre</dt>
        <dd className="font-medium break-words text-primary">{merchant.name}</dd>
        <dt className="sr-only">Estado</dt>
        <dd className="text-muted-foreground">Club {merchantStatusLabels[merchant.status].toLowerCase()}</dd>
        {!merchant.logoUrl && <dd className="text-muted-foreground">Todavía sin logo.</dd>}
      </dl>
    </div>
  );
}
