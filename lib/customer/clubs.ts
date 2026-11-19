import { stampCount } from "@/lib/text";
import type { MembershipSummary } from "./types";

type ClubProgress = Pick<MembershipSummary, "balance" | "stampsRequired" | "canRedeem"> & {
  merchant: Pick<MembershipSummary["merchant"], "status">;
};

const statusLabels: Partial<Record<MembershipSummary["merchant"]["status"], string>> = {
  PAUSED: "Pausado",
  ENDED: "Finalizado",
};

// Con el club finalizado ya no se canjea: la tarjeta completa no se ofrece como premio listo.
export function prizeReady(club: ClubProgress): boolean {
  return club.canRedeem && club.merchant.status !== "ENDED";
}

// La línea de cada club en "Mi cuenta": el premio listo, o los sellos y el estado del club.
export function clubSummary(club: ClubProgress): string {
  if (prizeReady(club)) return "¡Premio listo! · Mostrá tu QR";
  const filled = Math.min(club.balance, club.stampsRequired);
  const status = statusLabels[club.merchant.status];
  return `${filled} de ${stampCount(club.stampsRequired)}${status ? ` · ${status}` : ""}`;
}

// En la cuenta el celular se muestra recortado: alcanza para reconocerlo en un teléfono compartido.
export function phoneEnding(phoneE164: string): string {
  return phoneE164.replace(/\D/g, "").slice(-4);
}
