import { z } from "zod";
import { cooldownMinutes, optionalColor, optionalGoogleReviewUrl, orNull } from "@/lib/merchants/fields";
import type { MerchantSettings } from "@/lib/settings/types";

export const settingsSchema = z.object({
  primaryColor: optionalColor,
  secondaryColor: optionalColor,
  googleReviewUrl: optionalGoogleReviewUrl,
  stampCooldownMinutes: cooldownMinutes,
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export function toSettingsValues(settings: MerchantSettings): SettingsValues {
  return {
    primaryColor: settings.primaryColor ?? "",
    secondaryColor: settings.secondaryColor ?? "",
    googleReviewUrl: settings.googleReviewUrl ?? "",
    stampCooldownMinutes: String(settings.stampCooldownMinutes),
  };
}

export function toSettingsBody(values: SettingsValues): MerchantSettings {
  return {
    primaryColor: orNull(values.primaryColor),
    secondaryColor: orNull(values.secondaryColor),
    googleReviewUrl: orNull(values.googleReviewUrl),
    stampCooldownMinutes: Number(values.stampCooldownMinutes),
  };
}
