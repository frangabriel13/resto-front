import Image from "next/image";
import { initials } from "@/lib/text";

export type IdentityMerchant = { name: string; logoUrl: string | null };

// Sobre la franja del color del comercio: el logo chico y el nombre con "Club de premios" debajo.
export function MerchantIdentity({ merchant }: { merchant: IdentityMerchant }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 text-primary-foreground">
      <IdentityLogo {...merchant} />
      <p className="flex min-w-0 flex-col">
        <span className="truncate text-[0.9375rem] leading-tight font-semibold">{merchant.name}</span>
        <span className="text-xs text-primary-foreground/85">Club de premios</span>
      </p>
    </div>
  );
}

// El logo de 40 px sobre el color del comercio: la imagen en blanco o las iniciales.
export function IdentityLogo({ name, logoUrl }: IdentityMerchant) {
  if (!logoUrl) {
    return (
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-[0.6875rem] bg-primary-foreground/16 text-sm font-semibold"
      >
        {initials(name)}
      </span>
    );
  }
  return (
    // `unoptimized`: se sirve tal cual desde el bucket de imágenes.
    <Image
      src={logoUrl}
      alt=""
      width={40}
      height={40}
      unoptimized
      loading="eager"
      className="size-10 shrink-0 rounded-[0.6875rem] bg-white object-contain"
    />
  );
}
