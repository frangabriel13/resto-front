import type { PieceDestinationType } from "@/lib/admin/types";

// Mismos criterios que la API (resto-api/src/modules/pieces/piece-fields.ts).
const whatsappHost = /^(?:api\.)?whatsapp\.com$|^wa\.me$/;
const googleReviewHost = /^(?:(?:[a-z0-9-]+\.)*google\.com(?:\.ar)?|(?:maps\.app\.)?goo\.gl|g\.page)$/;

export const destinationTypeLabels: Record<PieceDestinationType, string> = {
  CLUBSY: "Club de fidelización (de siempre)",
  GOOGLE_REVIEWS: "Reseñas de Google",
  WHATSAPP: "WhatsApp",
  OTHER: "Otro link",
};

export function isValidDestinationUrl(type: PieceDestinationType, value: string): boolean {
  if (type === "CLUBSY") return value === "";
  if (value === "") return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (type === "GOOGLE_REVIEWS") return googleReviewHost.test(url.hostname);
  if (type === "WHATSAPP") return whatsappHost.test(url.hostname);
  return true;
}
