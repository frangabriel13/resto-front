import { z } from "zod";
import type { components } from "@/lib/api/schema";
import { looksLikePhone } from "@/lib/customer/phone";
import { orNull } from "@/lib/merchants/fields";

type MerchantProfile = components["schemas"]["MerchantProfile"];
type MerchantProfileBody = components["schemas"]["MerchantProfileBody"];

const optionalText = (max: number) =>
  z.string().trim().max(max, `Hasta ${max} caracteres.`);

// Acepta coma o punto, con un decimal como mucho, como la API (1,0 a 5,0).
export function parseRating(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d(?:[.,]\d)?$/.test(trimmed)) return null;
  const rating = Number(trimmed.replace(",", "."));
  return rating >= 1 && rating <= 5 ? rating : null;
}

export const formatRating = (rating: number) => rating.toFixed(1).replace(".", ",");

const maxReviews = 10_000_000;

export const profileSchema = z
  .object({
    contactName: optionalText(100),
    contactPhone: z
      .string()
      .trim()
      .refine((value) => value === "" || looksLikePhone(value), "Ingresá un celular válido."),
    address: optionalText(200),
    googleRatingInitial: z
      .string()
      .trim()
      .refine((value) => value === "" || parseRating(value) !== null, "Un número de 1 a 5, por ejemplo 4,5."),
    googleReviewsInitial: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (/^\d+$/.test(value) && Number(value) <= maxReviews),
        "Ingresá una cantidad.",
      ),
    googleDataTakenOn: z.string().trim(),
    notes: optionalText(2000),
  })
  .superRefine((profile, ctx) => {
    const hasGoogleData = profile.googleRatingInitial !== "" || profile.googleReviewsInitial !== "";
    if (hasGoogleData === (profile.googleDataTakenOn !== "")) return;
    ctx.addIssue({
      code: "custom",
      path: ["googleDataTakenOn"],
      message: hasGoogleData
        ? "Indicá el día en que tomaste la puntuación o las reseñas."
        : "Sin puntuación ni reseñas, dejá la fecha vacía.",
    });
  });

export type ProfileValues = z.infer<typeof profileSchema>;

export const emptyProfileValues: ProfileValues = {
  contactName: "",
  contactPhone: "",
  address: "",
  googleRatingInitial: "",
  googleReviewsInitial: "",
  googleDataTakenOn: "",
  notes: "",
};

export function toProfileValues(profile: MerchantProfile): ProfileValues {
  return {
    contactName: profile.contactName ?? "",
    contactPhone: profile.contactPhone ?? "",
    address: profile.address ?? "",
    googleRatingInitial: profile.googleRatingInitial === null ? "" : formatRating(profile.googleRatingInitial),
    googleReviewsInitial: profile.googleReviewsInitial === null ? "" : String(profile.googleReviewsInitial),
    googleDataTakenOn: profile.googleDataTakenOn ?? "",
    notes: profile.notes ?? "",
  };
}

// La ficha va completa: `null` borra lo que se vació.
export function toProfileBody(values: ProfileValues): MerchantProfileBody {
  return {
    contactName: orNull(values.contactName),
    contactPhone: orNull(values.contactPhone),
    address: orNull(values.address),
    googleRatingInitial: values.googleRatingInitial ? parseRating(values.googleRatingInitial) : null,
    googleReviewsInitial: values.googleReviewsInitial ? Number(values.googleReviewsInitial) : null,
    googleDataTakenOn: orNull(values.googleDataTakenOn),
    notes: orNull(values.notes),
  };
}

// El celular llega en E.164 (+549…); wa.me lo pide sin el +.
export const whatsappChatUrl = (phoneE164: string) => `https://wa.me/${phoneE164.replace(/\D/g, "")}`;
