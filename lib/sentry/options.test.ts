import { describe, expect, it } from "vitest";
import { sentryOptions, tracesSampleRate } from "./options";

describe("sentryOptions", () => {
  it("sin DSN, Sentry queda apagado", () => {
    expect(sentryOptions({ environment: "production" })).toBeNull();
  });

  it("apaga la recolección de datos personales", () => {
    const options = sentryOptions({ dsn: "https://k@o1.ingest.sentry.io/1", environment: "preview" });
    expect(options).toMatchObject({
      environment: "preview",
      tracesSampleRate: 0,
      dataCollection: { userInfo: false, cookies: false, httpBodies: [], urlQueryParams: false },
    });
  });
});

describe("tracesSampleRate", () => {
  it("usa 0 si falta o no es válida", () => {
    expect(tracesSampleRate(undefined)).toBe(0);
    expect(tracesSampleRate("2")).toBe(0);
    expect(tracesSampleRate("abc")).toBe(0);
    expect(tracesSampleRate("0.25")).toBe(0.25);
  });
});
