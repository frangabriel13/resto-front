import Image from "next/image";
import { MerchantLogo } from "@/components/club/merchant-logo";
import { LegalLinks } from "@/components/legal/legal-links";
import { brandStyle } from "@/lib/brand/colors";
import type { ClubPiece } from "@/lib/customer/types";
import { cn } from "@/lib/utils";
import icon from "@/public/icon.png";
import { SocialLinks } from "./social-links";

type MerchantPageShellProps = {
  merchant: ClubPiece["merchant"];
  socials: ClubPiece["page"]["socials"];
  showCover?: boolean;
  children: React.ReactNode;
};

export function MerchantPageShell({ merchant, socials, showCover = true, children }: MerchantPageShellProps) {
  const coverUrl = showCover ? merchant.coverUrl : null;
  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-background">
      {coverUrl && (
        <div className="relative aspect-2/1 max-h-72 w-full bg-muted">
          {/* `unoptimized`: se sirve tal cual desde el bucket de imágenes, como el logo. */}
          <Image src={coverUrl} alt="" fill unoptimized loading="eager" className="object-cover" />
        </div>
      )}
      <header
        className={cn(
          "flex flex-col items-center gap-3 rounded-b-3xl bg-primary px-6 pb-8 text-center text-primary-foreground",
          !coverUrl && "pt-10",
        )}
      >
        <span className={cn("relative rounded-2xl", coverUrl && "-mt-8 shadow-md")}>
          <MerchantLogo name={merchant.name} logoUrl={merchant.logoUrl} />
        </span>
        <h1 className="font-heading text-2xl font-semibold break-words">{merchant.name}</h1>
      </header>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-6">{children}</div>
      <footer className="mt-auto flex flex-col items-center gap-4 px-4 pt-4 pb-8 text-xs text-muted-foreground">
        <SocialLinks socials={socials} />
        <span className="flex items-center gap-2">
          <Image src={icon} alt="" className="size-4" />
          by Clubsy
        </span>
        <LegalLinks />
      </footer>
    </main>
  );
}
