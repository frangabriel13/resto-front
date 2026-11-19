import type { ClubPiece } from "@/lib/customer/types";
import { ClubsyCredit } from "./clubsy-credit";
import { SocialLinks } from "./social-links";

// Pegado al fondo de la pantalla, como un footer, y al menos a 32 px de la tarjeta.
export function MerchantFooter({ socials }: { socials: ClubPiece["page"]["socials"] }) {
  return (
    <footer className="mt-auto flex flex-col items-center gap-6 px-5 pt-8 pb-6.5">
      <SocialLinks socials={socials} />
      <ClubsyCredit />
    </footer>
  );
}
