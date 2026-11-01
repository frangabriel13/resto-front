import type { components, paths } from "@/lib/api/schema";

export type SettingsView = components["schemas"]["SettingsView"];
export type MerchantSettings = components["schemas"]["MerchantSettings"];
export type SettingsBody = paths["/panel/settings"]["put"]["requestBody"]["content"]["application/json"];
