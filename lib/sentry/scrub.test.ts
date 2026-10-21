import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { scrubBreadcrumb, scrubEvent, stripQuery } from "./scrub";

describe("stripQuery", () => {
  it("deja solo la ruta", () => {
    expect(stripQuery("https://clubsy.test/panel/restablecer?token=abc")).toBe("https://clubsy.test/panel/restablecer");
    expect(stripQuery("/api/panel/customers?query=1155550811")).toBe("/api/panel/customers");
    expect(stripQuery("/c/cafe#historial")).toBe("/c/cafe");
    expect(stripQuery("/cuenta")).toBe("/cuenta");
  });
});

describe("scrubEvent", () => {
  it("saca cookies, body, query y cabeceras sensibles", () => {
    const event = scrubEvent({
      type: undefined,
      request: {
        url: "https://clubsy.test/panel/restablecer?token=abc",
        query_string: "token=abc",
        cookies: { fs_staff: "secreto" },
        data: { phone: "+5491155550811" },
        headers: { Cookie: "fs_staff=secreto", "User-Agent": "Chrome", authorization: "x", referer: "https://a?b" },
      },
      contexts: { nextjs: { request_path: "/panel/clientes?q=1155", route_type: "render" } },
    } as ErrorEvent);

    expect(event.request).toEqual({
      url: "https://clubsy.test/panel/restablecer",
      headers: { "User-Agent": "Chrome" },
    });
    expect(event.contexts?.nextjs).toEqual({ request_path: "/panel/clientes", route_type: "render" });
  });

  it("deja pasar un evento sin request", () => {
    const event = { type: undefined, message: "x" } as ErrorEvent;
    expect(scrubEvent(event)).toBe(event);
  });
});

describe("scrubBreadcrumb", () => {
  it("descarta los logs de consola", () => {
    expect(scrubBreadcrumb({ category: "console", message: "+5491155550811" })).toBeNull();
  });

  it("deja solo la ruta en pedidos y navegaciones", () => {
    expect(
      scrubBreadcrumb({ category: "fetch", data: { url: "/api/panel/customers?query=1155", method: "GET" } }),
    ).toEqual({ category: "fetch", data: { url: "/api/panel/customers", method: "GET" } });
    expect(
      scrubBreadcrumb({ category: "navigation", data: { from: "/cuenta?volver=/c/x", to: "/c/x?aviso=salida" } }),
    ).toEqual({ category: "navigation", data: { from: "/cuenta", to: "/c/x" } });
  });
});
