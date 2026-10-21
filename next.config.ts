import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import { sentryBuildErrors } from "./lib/sentry/build-check";

// Se lee al hacer el build: los rewrites quedan fijos en el resultado.
const apiUrl = process.env.API_URL ?? "http://localhost:3001";

const sentryErrors = sentryBuildErrors(process.env);
if (sentryErrors.length > 0) throw new Error(`Configuración de Sentry inválida:\n${sentryErrors.join("\n")}`);

const nextConfig: NextConfig = {
  // La imagen de Docker lleva solo el servidor y lo que usa (ver Dockerfile).
  output: "standalone",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Sube los source maps con SENTRY_AUTH_TOKEN, SENTRY_ORG y SENTRY_PROJECT (sin
// el token no sube nada) y después los borra, para que no queden públicos. La
// release es el commit que despliega Coolify, como en la API.
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  telemetry: false,
  release: { name: process.env.SOURCE_COMMIT || undefined },
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
