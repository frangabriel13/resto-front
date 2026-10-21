import Image from "next/image";
import { brandStyle } from "@/lib/brand/colors";
import { LegalLinks } from "@/components/legal/legal-links";
import icon from "@/public/icon.png";
import { MerchantLogo } from "./merchant-logo";

type ShellMerchant = {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
};

// Pantallas del cliente con la marca del comercio: encabezado con logo y colores propios.
export function ClubShell({
  merchant,
  footer,
  children,
}: {
  merchant: ShellMerchant;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-background">
      <header className="flex flex-col items-center gap-3 rounded-b-3xl bg-primary px-6 pt-10 pb-8 text-center text-primary-foreground">
        <MerchantLogo name={merchant.name} logoUrl={merchant.logoUrl} />
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold break-words">{merchant.name}</h1>
          <p className="text-sm opacity-80">Club de beneficios</p>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-6">{children}</div>
      <footer className="mt-auto flex flex-col items-center gap-4 px-4 pt-4 pb-8 text-xs text-muted-foreground">
        {footer}
        <span className="flex items-center gap-2">
          <Image src={icon} alt="" className="size-4" />
          Club de beneficios con Clubsy
        </span>
        <LegalLinks />
      </footer>
    </main>
  );
}
