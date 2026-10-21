import { describe, expect, it } from "vitest";
import { forwardedHeaders } from "./forwarded-headers";

describe("forwardedHeaders", () => {
  it("reenvía las cookies y la IP del cliente", () => {
    const incoming = new Headers({ "x-forwarded-for": "203.0.113.7", "user-agent": "Chrome" });
    expect(forwardedHeaders("fs_customer=abc", incoming)).toEqual({
      cookie: "fs_customer=abc",
      "x-forwarded-for": "203.0.113.7",
    });
  });

  it("conserva la cadena completa de proxies", () => {
    const incoming = new Headers({ "x-forwarded-for": "1.2.3.4, 203.0.113.7" });
    expect(forwardedHeaders("", incoming)).toEqual({ "x-forwarded-for": "1.2.3.4, 203.0.113.7" });
  });

  it("sin cookies ni proxy no agrega nada", () => {
    expect(forwardedHeaders("", new Headers())).toEqual({});
  });
});
