# syntax=docker/dockerfile:1

FROM node:24.14.1-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack install

# Sin scripts: el postinstall (copiar el .wasm del lector de QR) necesita el
# código, así que corre en el build.
FROM base AS deps
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
# Quedan fijos en el resultado: el destino del proxy /api/* y las NEXT_PUBLIC_*.
ARG API_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
ARG NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0
ARG REQUIRE_SENTRY_DSN=true
ARG SOURCE_COMMIT
ARG SENTRY_ORG
ARG SENTRY_PROJECT
# El token para subir los source maps va como secreto: no queda en la imagen.
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  test -n "$API_URL" || { echo "Falta el build arg API_URL" >&2; exit 1; }; \
  node scripts/copy-zxing-wasm.mjs && pnpm build

FROM node:24.14.1-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch(`http://localhost:${process.env.PORT}/health`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "server.js"]
