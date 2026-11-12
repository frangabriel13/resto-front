import { brandStyle } from "@/lib/brand/colors";
import type { ClubPiece } from "@/lib/customer/types";
import { MerchantCover } from "./merchant-cover";
import { MerchantFooter } from "./merchant-footer";
import { MerchantHeader } from "./merchant-header";

type MerchantPageShellProps = {
  merchant: ClubPiece["merchant"];
  socials: ClubPiece["page"]["socials"];
  showCover?: boolean;
  children: React.ReactNode;
};

// La portada y, montada sobre ella, una sola tarjeta flotante con el logo, el nombre y el contenido.
export function MerchantPageShell({ merchant, socials, showCover = true, children }: MerchantPageShellProps) {
  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-background">
      <MerchantCover coverUrl={showCover ? merchant.coverUrl : null} />
      <div className="relative mx-4.5 -mt-16 rounded-[0.875rem] bg-background px-4 pb-2 shadow-[0_2px_6px_rgb(0_0_0/0.04),0_12px_32px_rgb(0_0_0/0.1)] sm:mx-auto sm:w-full sm:max-w-md">
        <MerchantHeader merchant={merchant} />
        <div className="mb-4.5 h-px bg-border" />
        <div className="flex flex-col gap-5">{children}</div>
      </div>
      <MerchantFooter socials={socials} />
    </main>
  );
}
