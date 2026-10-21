import * as Sentry from "@sentry/nextjs";
import { sentryEnv, sentryOptions } from "@/lib/sentry/options";

export function register() {
  const options = sentryOptions(sentryEnv());
  if (options) Sentry.init(options);
}

// Errores inesperados del servidor (páginas, server functions). Los de la API
// no llegan acá: callApi los devuelve como resultado.
export const onRequestError = Sentry.captureRequestError;
