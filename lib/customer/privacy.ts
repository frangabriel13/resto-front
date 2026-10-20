import type { MembershipCard } from "./types";

// Con el club finalizado no tiene sentido sumarse a novedades; revocarlas, siempre.
export function showConsentToggle(status: MembershipCard["merchant"]["status"], consent: boolean): boolean {
  return status !== "ENDED" || consent;
}

export const deleteConfirmWord = "BORRAR";

export function deleteConfirmed(input: string): boolean {
  return input.trim().toUpperCase() === deleteConfirmWord;
}
