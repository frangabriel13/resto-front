import type { ScanResult } from "./types";

// "hace 12 minutos" para el aviso de cooldown.
export function timeAgo(iso: string, now: number): string {
  const minutes = Math.floor((now - Date.parse(iso)) / 60_000);
  if (minutes < 1) return "hace un momento";
  if (minutes === 1) return "hace 1 minuto";
  if (minutes < 60) return `hace ${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `hace ${hours} h${rest ? ` ${rest} min` : ""}`;
}

// "8 de 8 y 1 para la próxima": los sellos de más pasan a la próxima tarjeta.
export function balanceText(balance: number, stampsRequired: number): string {
  return balance > stampsRequired
    ? `${stampsRequired} de ${stampsRequired} y ${balance - stampsRequired} para la próxima`
    : `${balance} de ${stampsRequired}`;
}

export function balanceAfterStamp(balance: number, stampsRequired: number): string {
  return balanceText(balance + 1, stampsRequired);
}

export type ScanActions = { redeem: boolean; stamp: "normal" | "override" | null };

// Con el club pausado no se suman sellos, pero se canjean las tarjetas completas.
export function scanActions(
  scan: ScanResult,
  options: { stampsAllowed: boolean; redeemAvailable: boolean },
): ScanActions {
  return {
    redeem: options.redeemAvailable && scan.membership.canRedeem,
    stamp: !options.stampsAllowed ? null : scan.cooldown.active ? "override" : "normal",
  };
}
