import { z } from "zod";
import { cooldownMinutes, optionalColor, optionalGoogleReviewUrl, orNull } from "@/lib/merchants/fields";
import { pageSchema, toPageBody, toPageValues } from "@/lib/merchants/page";
import type { SettingsBody, SettingsView } from "@/lib/settings/types";

export const settingsSchema = z.object({
  primaryColor: optionalColor,
  secondaryColor: optionalColor,
  googleReviewUrl: optionalGoogleReviewUrl,
  stampCooldownMinutes: cooldownMinutes,
  page: pageSchema,
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export function toSettingsValues({ settings, page }: SettingsView): SettingsValues {
  return {
    primaryColor: settings.primaryColor ?? "",
    secondaryColor: settings.secondaryColor ?? "",
    googleReviewUrl: settings.googleReviewUrl ?? "",
    stampCooldownMinutes: String(settings.stampCooldownMinutes),
    page: toPageValues(page),
  };
}

export function toSettingsBody(values: SettingsValues): SettingsBody {
  return {
    primaryColor: orNull(values.primaryColor),
    secondaryColor: orNull(values.secondaryColor),
    googleReviewUrl: orNull(values.googleReviewUrl),
    stampCooldownMinutes: Number(values.stampCooldownMinutes),
    page: toPageBody(values.page),
  };
}
