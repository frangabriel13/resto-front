import { z } from "zod";
import type { components } from "@/lib/api/schema";
import {
  cooldownMinutes,
  optionalColor,
  optionalGoogleReviewUrl,
  optionalHttpsUrl,
  orNull,
} from "@/lib/merchants/fields";
import { emptyProfileValues, profileSchema, toProfileBody, toProfileValues } from "@/lib/admin/profile";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const name = z.string().trim().min(1, "Ingresá el nombre.").max(100, "Hasta 100 caracteres.");

const slug = z
  .string()
  .trim()
  .min(3, "Tiene que tener al menos 3 caracteres.")
  .max(60, "Hasta 60 caracteres.")
  .regex(slugPattern, "Solo minúsculas, números y guiones.");

// En el alta, vacío es "que lo decida la API": el slug se arma con el nombre (con un número si ya
// existe) y los minutos entre sellos son los de por defecto.
// Con `z.union` el error sería un genérico "Invalid input" en vez del mensaje del campo.
const orEmpty = (schema: z.ZodString) =>
  z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value === "") return;
      const result = schema.safeParse(value);
      result.error?.issues.forEach((issue) => ctx.addIssue({ code: "custom", message: issue.message }));
    });

export const merchantDataSchema = z.object({
  name,
  googleReviewUrl: optionalGoogleReviewUrl,
  profile: profileSchema,
});

export type MerchantDataValues = z.infer<typeof merchantDataSchema>;

export const clubSettingsSchema = z.object({
  slug,
  logoUrl: optionalHttpsUrl,
  primaryColor: optionalColor,
  secondaryColor: optionalColor,
  stampCooldownMinutes: cooldownMinutes,
});

export type ClubSettingsValues = z.infer<typeof clubSettingsSchema>;

export const newMerchantSchema = merchantDataSchema.extend({
  ...clubSettingsSchema.shape,
  slug: orEmpty(slug),
  stampCooldownMinutes: orEmpty(cooldownMinutes),
});

export type NewMerchantValues = z.infer<typeof newMerchantSchema>;

type Merchant = components["schemas"]["Merchant"];
type CreateMerchantBody = components["schemas"]["CreateMerchantBody"];
type UpdateMerchantBody = components["schemas"]["UpdateMerchantBody"];

export const newMerchantDefaults: NewMerchantValues = {
  name: "",
  googleReviewUrl: "",
  profile: emptyProfileValues,
  slug: "",
  logoUrl: "",
  primaryColor: "",
  secondaryColor: "",
  stampCooldownMinutes: "",
};

export function toMerchantDataValues(merchant: Merchant): MerchantDataValues {
  return {
    name: merchant.name,
    googleReviewUrl: merchant.googleReviewUrl ?? "",
    profile: toProfileValues(merchant.profile),
  };
}

export function toMerchantDataBody(values: MerchantDataValues): UpdateMerchantBody {
  return {
    name: values.name,
    googleReviewUrl: orNull(values.googleReviewUrl),
    profile: toProfileBody(values.profile),
  };
}

export function toClubSettingsValues(merchant: Merchant): ClubSettingsValues {
  return {
    slug: merchant.slug,
    logoUrl: merchant.logoUrl ?? "",
    primaryColor: merchant.primaryColor ?? "",
    secondaryColor: merchant.secondaryColor ?? "",
    stampCooldownMinutes: String(merchant.stampCooldownMinutes),
  };
}

export function toClubSettingsBody(values: ClubSettingsValues): UpdateMerchantBody {
  return {
    slug: values.slug,
    logoUrl: orNull(values.logoUrl),
    primaryColor: orNull(values.primaryColor),
    secondaryColor: orNull(values.secondaryColor),
    stampCooldownMinutes: Number(values.stampCooldownMinutes),
  };
}

export function toCreateMerchantBody(values: NewMerchantValues): CreateMerchantBody {
  return {
    name: values.name,
    googleReviewUrl: orNull(values.googleReviewUrl),
    profile: toProfileBody(values.profile),
    slug: values.slug || undefined,
    logoUrl: orNull(values.logoUrl),
    primaryColor: orNull(values.primaryColor),
    secondaryColor: orNull(values.secondaryColor),
    stampCooldownMinutes: values.stampCooldownMinutes ? Number(values.stampCooldownMinutes) : undefined,
  };
}

export const ownerSchema = z.object({
  email: z.email("Ingresá un email válido."),
  name,
});

export type OwnerValues = z.infer<typeof ownerSchema>;
