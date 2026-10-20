import { z } from "zod";
import type { components } from "@/lib/api/schema";
import {
  cooldownMinutes,
  optionalColor,
  optionalGoogleReviewUrl,
  optionalHttpsUrl,
  orNull,
} from "@/lib/merchants/fields";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  logoUrl: optionalHttpsUrl,
  primaryColor: optionalColor,
  secondaryColor: optionalColor,
  googleReviewUrl: optionalGoogleReviewUrl,
  stampCooldownMinutes: cooldownMinutes,
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
    logoUrl: orNull(values.logoUrl),
    primaryColor: orNull(values.primaryColor),
    secondaryColor: orNull(values.secondaryColor),
    googleReviewUrl: orNull(values.googleReviewUrl),
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
