import { MerchantLogo } from "@/components/club/merchant-logo";
import { StampGrid } from "@/components/rewards/stamp-grid";
import { brandStyle } from "@/lib/brand/colors";
import { hexColorPattern } from "@/lib/merchants/fields";

const validColor = (value: string) => (hexColorPattern.test(value) ? value : null);

// Cómo ve el cliente su tarjeta con estos colores (con los mismos cálculos de contraste).
export function BrandPreview({
  name,
  logoUrl,
  primaryColor,
  secondaryColor,
}: {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}) {
  const style = brandStyle({ primaryColor: validColor(primaryColor), secondaryColor: validColor(secondaryColor) });
  return (
    <div style={style} aria-label="Vista previa de la tarjeta del cliente" className="overflow-hidden rounded-2xl border bg-background">
      <div className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
        <MerchantLogo name={name} logoUrl={logoUrl} />
        <span className="font-heading text-lg font-semibold break-words">{name}</span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 text-primary-foreground">
          <StampGrid stampsRequired={8} filled={3} />
          <p className="text-sm font-medium">Te faltan 5 sellos para tu premio.</p>
        </div>
        <span className="flex h-10 items-center justify-center rounded-lg bg-cta text-sm font-medium text-cta-foreground">
          Botón principal
        </span>
      </div>
    </div>
  );
}
