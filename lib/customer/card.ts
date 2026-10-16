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
  return `¡Completaste tu tarjeta! Pedile al local que te canjee el premio.${next}`;
}
