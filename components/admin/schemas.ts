import { z } from "zod";
import type { components } from "@/lib/api/schema";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), {
    message: "Ingresá una URL completa (https://…).",
  });

const optionalColor = z
  .string()
  .trim()
  .refine((value) => value === "" || /^#[0-9a-fA-F]{6}$/.test(value), {
    message: "Usá el formato #RRGGBB.",
  });

const name = z.string().trim().min(1, "Ingresá el nombre.").max(100, "Hasta 100 caracteres.");

const slug = z
  .string()
  .trim()
  .min(3, "Tiene que tener al menos 3 caracteres.")
  .max(60, "Hasta 60 caracteres.")
  .regex(slugPattern, "Solo minúsculas, números y guiones.");

export const newMerchantSchema = z.object({ name, slug });

export type NewMerchantValues = z.infer<typeof newMerchantSchema>;

export const merchantSettingsSchema = z.object({
  name,
  slug,
  logoUrl: optionalUrl,
  primaryColor: optionalColor,
  secondaryColor: optionalColor,
  googleReviewUrl: optionalUrl,
  stampCooldownMinutes: z
    .string()
    .trim()
    .regex(/^\d+$/, "Ingresá una cantidad de minutos.")
    .refine((value) => Number(value) <= 1440, "Hasta 1440 minutos (24 horas)."),
});

export type MerchantSettingsValues = z.infer<typeof merchantSettingsSchema>;

type Merchant = components["schemas"]["Merchant"];
type UpdateMerchantBody = components["schemas"]["UpdateMerchantBody"];

export function toSettingsValues(merchant: Merchant): MerchantSettingsValues {
  return {
    name: merchant.name,
    slug: merchant.slug,
    logoUrl: merchant.logoUrl ?? "",
    primaryColor: merchant.primaryColor ?? "",
    secondaryColor: merchant.secondaryColor ?? "",
    googleReviewUrl: merchant.googleReviewUrl ?? "",
    stampCooldownMinutes: String(merchant.stampCooldownMinutes),
  };
}

export function toUpdateMerchantBody(values: MerchantSettingsValues): UpdateMerchantBody {
  return {
    name: values.name,
    slug: values.slug,
    logoUrl: values.logoUrl || null,
    primaryColor: values.primaryColor || null,
    secondaryColor: values.secondaryColor || null,
    googleReviewUrl: values.googleReviewUrl || null,
    stampCooldownMinutes: Number(values.stampCooldownMinutes),
  };
}

export const pieceSchema = z.object({
  label: z.string().trim().min(1, "Ingresá un nombre.").max(60, "Hasta 60 caracteres."),
});

export type PieceValues = z.infer<typeof pieceSchema>;

export const ownerSchema = z.object({
  email: z.email("Ingresá un email válido."),
  name,
});

export type OwnerValues = z.infer<typeof ownerSchema>;
