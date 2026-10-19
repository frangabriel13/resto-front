import type { PanelMembership } from "@/lib/stamps/types";

// Cómo arranca la tarjeta después del canje (con los sellos que sobraron).
export function nextCardText({ balance, stampsRequired, canRedeem }: PanelMembership): string {
  if (canRedeem) return "Con los sellos que le sobraron ya completó la próxima tarjeta.";
  if (balance === 0) return "Arranca una tarjeta nueva.";
  return `Arranca una tarjeta nueva con ${balance} de ${stampsRequired}.`;
}
