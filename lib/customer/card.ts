import { stampCount as stamps } from "@/lib/text";

type Progress = { balance: number; stampsRequired: number; remaining: number; canRedeem: boolean };

export function filledStamps({ balance, stampsRequired }: Progress): number {
  return Math.min(balance, stampsRequired);
}

// El titular de la tarjeta: cuánto falta o que ya la completó, y qué hacer con eso.
export function cardHeadline(
  progress: Progress,
  { reward, canShowQr, ended }: { reward: string; canShowQr: boolean; ended: boolean },
): { title: string; detail: string } {
  if (!progress.canRedeem) {
    const title = `${progress.remaining === 1 ? "Te falta" : "Te faltan"} ${stamps(progress.remaining)}`;
    return { title, detail: ended ? "El club finalizó: ya no se suman sellos." : `Premio: ${reward}.` };
  }
  const extra = progress.balance - progress.stampsRequired;
  const next = extra > 0 ? ` Ya tenés ${stamps(extra)} para la próxima.` : "";
  const detail = canShowQr ? "Mostrá tu QR en la caja y llevate tu premio." : `Tu premio: ${reward}.`;
  return { title: "¡Completaste tu tarjeta!", detail: `${detail}${next}` };
}

export function cardTitle(cycle: number): string {
  return cycle > 1 ? `Tarjeta n.º ${cycle}` : "Tu tarjeta";
}

// Los sellos de más del canje anterior arrancan la tarjeta nueva.
export function carryOverMessage({ cycle, carryOver }: { cycle: number; carryOver: number }): string | null {
  if (cycle === 1 || carryOver === 0) return null;
  return `Arrancaste con ${stamps(carryOver)} que te ${carryOver === 1 ? "sobró" : "sobraron"} de la tarjeta anterior.`;
}
