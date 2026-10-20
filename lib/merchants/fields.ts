import { z } from "zod";

// Mismos criterios que la API (resto-api/src/modules/merchants/merchant-fields.ts).
export const hexColorPattern = /^#[0-9a-fA-F]{6}$/;
const googleReviewHost = /^(?:(?:[a-z0-9-]+\.)*google\.com(?:\.ar)?|(?:maps\.app\.)?goo\.gl|g\.page)$/;
export const maxCooldownMinutes = 1440;

export function isGoogleReviewUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && googleReviewHost.test(url.hostname);
  } catch {
    return false;
  }
}

export const optionalHttpsUrl = z
  .string()
  .trim()
  .max(500, "Hasta 500 caracteres.")
  .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), {
    message: "Usá una dirección completa que empiece con https://",
  });

// Se muestra a todos los clientes: solo Google, para que no sirva para mandarlos a otro sitio.
export const optionalGoogleReviewUrl = z
  .string()
  .trim()
  .max(500, "Hasta 500 caracteres.")
  .refine((value) => value === "" || isGoogleReviewUrl(value), {
    message: "Tiene que ser un link https de Google (por ejemplo, https://g.page/…).",
  });

export const optionalColor = z
  .string()
  .trim()
  .refine((value) => value === "" || hexColorPattern.test(value), { message: "Usá el formato #RRGGBB." });

export const cooldownMinutes = z
  .string()
  .trim()
  .regex(/^\d+$/, "Ingresá una cantidad de minutos.")
  .refine((value) => Number(value) <= maxCooldownMinutes, "Hasta 1440 minutos (24 horas).");

// Valor del formulario → body de la API: vacío es "sin cargar".
export const orNull = (value: string) => value || null;
