import { z } from "zod";
import type { components } from "@/lib/api/schema";
import { looksLikePhone } from "@/lib/customer/phone";
import { instagramUsernamePattern, isFacebookUrl, orNull, tiktokUsernamePattern } from "./fields";

type MerchantPage = components["schemas"]["MerchantPage"];
type MerchantPageBody = components["schemas"]["MerchantPageBody"];
type WifiSecurity = NonNullable<MerchantPage["wifi"]>["security"];

export const wifiSecurityOptions: { value: WifiSecurity; label: string; description: string }[] = [
  { value: "WPA", label: "Con contraseña", description: "La mayoría de las redes (WPA o WPA2)." },
  { value: "WEP", label: "WEP", description: "Solo routers muy viejos." },
  { value: "NONE", label: "Sin contraseña", description: "Red abierta." },
];

// Como la API: WPA de 8 a 63 caracteres y WEP de 5 a 26.
const passwordLength: Record<Exclude<WifiSecurity, "NONE">, [number, number]> = { WPA: [8, 63], WEP: [5, 26] };

const wifiSchema = z
  .object({
    ssid: z.string().trim().max(32, "Hasta 32 caracteres."),
    security: z.enum(["WPA", "WEP", "NONE"]),
    // Sin `trim`: un espacio puede ser parte de la contraseña.
    password: z.string(),
  })
  .superRefine(({ ssid, security, password }, ctx) => {
    if (security === "NONE") return;
    if (ssid === "") {
      if (password !== "") ctx.addIssue({ code: "custom", path: ["ssid"], message: "Ingresá el nombre de la red." });
      return;
    }
    const [min, max] = passwordLength[security];
    if (password.length < min || password.length > max) {
      ctx.addIssue({ code: "custom", path: ["password"], message: `De ${min} a ${max} caracteres.` });
    }
  });

const optionalPattern = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || pattern.test(value), message);

// `wifi` anidado como en la API, así sus errores (`page.wifi.password`) caen en su campo.
export const pageSchema = z.object({
  wifi: wifiSchema,
  instagramUsername: optionalPattern(instagramUsernamePattern, "Ingresá el usuario, por ejemplo @cafedelaesquina."),
  tiktokUsername: optionalPattern(tiktokUsernamePattern, "Ingresá el usuario, por ejemplo @cafedelaesquina."),
  whatsappPhone: z
    .string()
    .trim()
    .refine((value) => value === "" || looksLikePhone(value), "Ingresá un celular válido."),
  facebookUrl: z
    .string()
    .trim()
    .max(500, "Hasta 500 caracteres.")
    .refine((value) => value === "" || isFacebookUrl(value), "Tiene que ser un link https de Facebook."),
});

export type PageValues = z.infer<typeof pageSchema>;

export const emptyPageValues: PageValues = {
  wifi: { ssid: "", security: "WPA", password: "" },
  instagramUsername: "",
  tiktokUsername: "",
  whatsappPhone: "",
  facebookUrl: "",
};

export function toPageValues(page: MerchantPage): PageValues {
  return {
    wifi: {
      ssid: page.wifi?.ssid ?? "",
      security: page.wifi?.security ?? "WPA",
      password: page.wifi?.password ?? "",
    },
    instagramUsername: page.instagramUsername ?? "",
    tiktokUsername: page.tiktokUsername ?? "",
    whatsappPhone: page.whatsappPhone ?? "",
    facebookUrl: page.facebookUrl ?? "",
  };
}

function toWifiBody({ ssid, security, password }: PageValues["wifi"]): MerchantPageBody["wifi"] {
  if (ssid === "") return null;
  // La API rechaza una contraseña en una red abierta.
  return security === "NONE" ? { security, ssid } : { security, ssid, password };
}

// Va completa: `null` borra lo que se vació.
export function toPageBody(values: PageValues): MerchantPageBody {
  return {
    wifi: toWifiBody(values.wifi),
    instagramUsername: orNull(values.instagramUsername),
    tiktokUsername: orNull(values.tiktokUsername),
    whatsappPhone: orNull(values.whatsappPhone),
    facebookUrl: orNull(values.facebookUrl),
  };
}
