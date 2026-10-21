import { describe, expect, it } from "vitest";
import { sentryBuildErrors } from "./build-check";

describe("sentryBuildErrors", () => {
  it("exige el DSN solo cuando la imagen lo pide", () => {
    expect(sentryBuildErrors({ REQUIRE_SENTRY_DSN: "true" })).toEqual([
      "NEXT_PUBLIC_SENTRY_DSN: la imagen de producción lo exige (REQUIRE_SENTRY_DSN=true).",
    ]);
    expect(sentryBuildErrors({ REQUIRE_SENTRY_DSN: "false" })).toEqual([]);
    expect(sentryBuildErrors({})).toEqual([]);
    expect(
      sentryBuildErrors({ REQUIRE_SENTRY_DSN: "true", NEXT_PUBLIC_SENTRY_DSN: "https://k@o1.ingest.sentry.io/1" }),
    ).toEqual([]);
  });

  it("rechaza una tasa de trazas fuera de 0 a 1", () => {
    expect(sentryBuildErrors({ NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: "2" })).toHaveLength(1);
    expect(sentryBuildErrors({ NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: "mucho" })).toHaveLength(1);
    expect(sentryBuildErrors({ NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: "0.1" })).toEqual([]);
  });
});
