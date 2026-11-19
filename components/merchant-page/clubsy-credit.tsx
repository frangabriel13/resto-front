import Image from "next/image";
import { LegalLinks } from "@/components/legal/legal-links";
import icon from "@/public/icon.png";

// La firma de Clubsy al pie de las pantallas del cliente: chica, con los legales.
export function ClubsyCredit() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Image src={icon} alt="" className="size-3.5" />
        by Clubsy
      </span>
      <span aria-hidden>·</span>
      <LegalLinks separated />
    </div>
  );
}
