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

// Íconos y detalles sobre fondo blanco: el principal si se distingue (3:1), si no casi negro.
export function inkColor(primary: string): string {
  return contrastRatio(primary, "#ffffff") >= 3 ? primary : "#111111";
}

// Mezcla un color con blanco: `amount` es cuánto queda del color (0.12 = un tono muy suave).
function tint(hex: string, amount: number): string {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${channels.map((c) => Math.round(255 - (255 - c) * amount).toString(16).padStart(2, "0")).join("")}`;
}

// La tarjeta de sellos: llena del color principal, salvo que el botón principal también lo use (el
// secundario no contrasta). Ahí pasa a un tono suave del principal (20 %), así el botón queda como único
// bloque lleno de la pantalla.
export function ticketColors(primary: string, cta: string) {
  if (cta !== primary) {
    const text = readableTextColor(primary);
    return { background: primary, text, prize: text, prizeText: primary };
  }
  const background = tint(primary, 0.2);
  const ink = inkColor(primary);
  return {
    background,
    text: contrastRatio(ink, background) >= 4.5 ? ink : "#111111",
    prize: primary,
    prizeText: readableTextColor(primary),
  };
}

// Pisa los colores del tema con los del comercio, solo dentro del contenedor que lo use.
export function brandStyle(colors: {
  primaryColor: string | null;
  secondaryColor: string | null;
}): CSSProperties {
  const primary = colors.primaryColor ?? clubsyColors.primary;
  const secondary = colors.secondaryColor ?? (colors.primaryColor ? primary : clubsyColors.secondary);
  const cta = actionColor(primary, secondary);
  const ticket = ticketColors(primary, cta);
  return {
    "--primary": primary,
    "--primary-foreground": readableTextColor(primary),
    "--brand": secondary,
    "--brand-foreground": readableTextColor(secondary),
    // El anillo de foco tiene que verse sobre blanco: el mismo color que el botón principal (3:1).
    "--ring": cta,
    "--cta": cta,
    "--cta-foreground": readableTextColor(cta),
    "--ink": inkColor(primary),
    "--ticket": ticket.background,
    "--ticket-foreground": ticket.text,
    "--ticket-prize": ticket.prize,
    "--ticket-prize-foreground": ticket.prizeText,
  } as CSSProperties;
}
