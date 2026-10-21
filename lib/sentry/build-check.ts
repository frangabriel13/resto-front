type BuildEnv = Record<string, string | undefined>;

// Lo usa next.config.ts: el DSN queda fijo en el build, así que una imagen de
// producción sin él no reportaría nada y nadie se enteraría. El Dockerfile lo
// exige por defecto (`REQUIRE_SENTRY_DSN=true`); el `pnpm build` local, no.
export function sentryBuildErrors(env: BuildEnv): string[] {
  const errors: string[] = [];
  if (env.REQUIRE_SENTRY_DSN === "true" && !env.NEXT_PUBLIC_SENTRY_DSN) {
    errors.push("NEXT_PUBLIC_SENTRY_DSN: la imagen de producción lo exige (REQUIRE_SENTRY_DSN=true).");
  }
  const rate = env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE;
  if (rate !== undefined && !(Number(rate) >= 0 && Number(rate) <= 1)) {
    errors.push("NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: tiene que ser un número entre 0 y 1.");
  }
  return errors;
}
