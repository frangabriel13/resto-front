import Image from "next/image";
import type { ClubPiece } from "@/lib/customer/types";
import { initials } from "@/lib/text";

type HeaderMerchant = Pick<ClubPiece["merchant"], "name" | "logoUrl">;

const badgeClass =
  "-mt-10.5 flex size-21 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[0_8px_24px_rgb(0_0_0/0.12)]";

function MerchantBadge({ name, logoUrl }: HeaderMerchant) {
  if (!logoUrl) {
    return (
      <span aria-hidden className={`${badgeClass} text-[1.625rem] font-semibold text-ink`}>
        {initials(name)}
      </span>
    );
  }
  return (
    <span className={badgeClass}>
      {/* `unoptimized`: se sirve tal cual desde el bucket de imágenes. */}
      <Image
        src={logoUrl}
        alt={`Logo de ${name}`}
        width={76}
        height={76}
        unoptimized
        loading="eager"
        className="size-full object-contain"
      />
    </span>
  );
}

// El logo apoyado en el borde de arriba de la tarjeta del menú y el nombre abajo.
export function MerchantHeader({ merchant }: { merchant: HeaderMerchant }) {
  return (
    <header className="flex flex-col items-center gap-2.5 pb-5 text-center">
      <MerchantBadge name={merchant.name} logoUrl={merchant.logoUrl} />
      <h1 className="font-heading text-[1.4375rem] leading-tight font-semibold tracking-tight break-words">
        {merchant.name}
      </h1>
    </header>
  );
}
