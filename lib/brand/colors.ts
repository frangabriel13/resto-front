import type { CSSProperties } from "react";

export const clubsyColors = { primary: "#001d67", secondary: "#fc5d00" };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Relación de contraste WCAG entre dos colores (1 a 21).
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// Texto blanco o casi negro, el que más contraste tenga con el fondo (WCAG).
export function readableTextColor(background: string): "#ffffff" | "#111111" {
  return contrastRatio(background, "#ffffff") >= contrastRatio(background, "#111111")
    ? "#ffffff"
    : "#111111";
}

// Color del botón principal sobre fondo blanco: el secundario si se distingue (WCAG pide 3:1
// para componentes), si no el principal y, si los dos son claros, casi negro.
export function actionColor(primary: string, secondary: string): string {
  if (contrastRatio(secondary, "#ffffff") >= 3) return secondary;
  if (contrastRatio(primary, "#ffffff") >= 3) return primary;
  return "#111111";
}

// Pisa los colores del tema con los del comercio, solo dentro del contenedor que lo use.
export function brandStyle(colors: {
  primaryColor: string | null;
  secondaryColor: string | null;
}): CSSProperties {
  const primary = colors.primaryColor ?? clubsyColors.primary;
  const secondary = colors.secondaryColor ?? (colors.primaryColor ? primary : clubsyColors.secondary);
  const cta = actionColor(primary, secondary);
  return {
    "--primary": primary,
    "--primary-foreground": readableTextColor(primary),
    "--brand": secondary,
    "--brand-foreground": readableTextColor(secondary),
    "--ring": secondary,
    "--cta": cta,
    "--cta-foreground": readableTextColor(cta),
  } as CSSProperties;
}
