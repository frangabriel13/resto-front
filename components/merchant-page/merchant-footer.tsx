import Image from "next/image";
import { LegalLinks } from "@/components/legal/legal-links";
import type { ClubPiece } from "@/lib/customer/types";
import icon from "@/public/icon.png";
import { SocialLinks } from "./social-links";

// Pegado al fondo de la pantalla, como un footer, y al menos a 32 px de la tarjeta.
export function MerchantFooter({ socials }: { socials: ClubPiece["page"]["socials"] }) {
  return (
    <footer className="mt-auto flex flex-col items-center gap-6 px-5 pt-8 pb-6.5">
      <SocialLinks socials={socials} />
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Image src={icon} alt="" className="size-3.5" />
          by Clubsy
        </span>
        <span aria-hidden>·</span>
        <LegalLinks separated />
      </div>
    </footer>
  );
}
