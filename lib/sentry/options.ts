import type { BrowserOptions } from "@sentry/nextjs";
import { scrubBreadcrumb, scrubEvent } from "./scrub";

export type SentryEnv = {
  dsn?: string;
  environment?: string;
  tracesSampleRate?: string;
};

// Las NEXT_PUBLIC_* se escriben completas para que Next las incruste en el
// código del navegador al hacer el build.
export function sentryEnv(): SentryEnv {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
  };
}

// Las mismas opciones para el navegador y el servidor. Sin DSN, Sentry queda apagado.
export function sentryOptions(env: SentryEnv) {
  if (!env.dsn) return null;
  return {
    dsn: env.dsn,
    environment: env.environment ?? "development",
    // En la v11 el SDK recolecta todo por defecto: acá se apaga lo que puede
    // traer nombres, teléfonos, códigos, contraseñas o cookies.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: { request: { allow: ["user-agent", "content-type"] }, response: false },
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
    tracesSampleRate: tracesSampleRate(env.tracesSampleRate),
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  } satisfies BrowserOptions;
}

export function tracesSampleRate(value: string | undefined): number {
  const rate = Number(value ?? 0);
  return rate >= 0 && rate <= 1 ? rate : 0;
}
