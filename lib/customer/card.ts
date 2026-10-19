import { stampCount as stamps } from "@/lib/text";

type Progress = { balance: number; stampsRequired: number; remaining: number; canRedeem: boolean };

export function filledStamps({ balance, stampsRequired }: Progress): number {
  return Math.min(balance, stampsRequired);
}

export function progressMessage(progress: Progress): string {
  if (!progress.canRedeem) {
    return `${progress.remaining === 1 ? "Te falta" : "Te faltan"} ${stamps(progress.remaining)} para tu premio.`;
  }
  const extra = progress.balance - progress.stampsRequired;
  const next = extra > 0 ? ` Ya tenés ${stamps(extra)} para la próxima.` : "";
  return `¡Completaste tu tarjeta!${next}`;
}

export function cardTitle(cycle: number): string {
  return cycle > 1 ? `Tarjeta n.º ${cycle}` : "Tu tarjeta";
}

// Los sellos de más del canje anterior arrancan la tarjeta nueva.
export function carryOverMessage({ cycle, carryOver }: { cycle: number; carryOver: number }): string | null {
  if (cycle === 1 || carryOver === 0) return null;
  return `Arrancaste con ${stamps(carryOver)} que te ${carryOver === 1 ? "sobró" : "sobraron"} de la tarjeta anterior.`;
}
