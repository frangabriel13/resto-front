import type { MembershipCard } from "./types";

// Activo: para sumar sellos y canjear. Pausado: solo para canjear una tarjeta completa. Finalizado: nunca.
export function showStampQr(status: MembershipCard["merchant"]["status"], canRedeem: boolean): boolean {
  return status === "ACTIVE" || (status === "PAUSED" && canRedeem);
}

// Vencimiento del token medido con el reloj del celular: el tiempo que le queda según el servidor
// (hora de la respuesta), contado desde que llegó. Así un celular con la hora corrida igual ve su QR.
export function localExpiry(expiresAt: string, serverDate: string | null, receivedAt: number): number {
  const serverNow = serverDate ? Date.parse(serverDate) : Number.NaN;
  const remaining = Date.parse(expiresAt) - (Number.isNaN(serverNow) ? receivedAt : serverNow);
  return receivedAt + remaining;
}

const safetyMs = 5_000;

// Cuándo pedir el próximo token: lo que indique la API, pero siempre antes de que venza el actual.
export function nextRefreshDelay(refreshInSeconds: number, expiresAt: number, now: number): number {
  const beforeExpiry = expiresAt - now - safetyMs;
  return Math.max(1_000, Math.min(refreshInSeconds * 1_000, beforeExpiry));
}

// Reintentos sin conexión: 2 s, 4 s, 8 s… hasta 15 s.
export function retryDelay(failures: number): number {
  return Math.min(15_000, 1_000 * 2 ** failures);
}
