import Image from "next/image";
import { initials } from "@/lib/text";

export function MerchantLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (!logoUrl) {
    return (
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-foreground text-xl font-semibold text-primary">
        {initials(name)}
      </span>
    );
  }
  return (
    // `unoptimized`: el logo es una URL externa cargada desde el admin; se muestra tal cual.
    <Image
      src={logoUrl}
      alt={`Logo de ${name}`}
      width={64}
      height={64}
      unoptimized
      loading="eager"
      className="size-16 rounded-2xl bg-white object-contain p-1"
    />
  );
}
