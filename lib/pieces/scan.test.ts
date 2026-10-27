import { afterEach, describe, expect, it, vi } from "vitest";
import { redirectTarget, registerScan } from "./scan";

const headers = (values: Record<string, string>) => new Headers(values);

afterEach(() => vi.unstubAllGlobals());

describe("redirectTarget", () => {
  it("devuelve la URL de los destinos externos", () => {
    expect(redirectTarget({ state: "REDIRECT", url: "https://instagram.com/cafe" })).toBe("https://instagram.com/cafe");
  });

  it("no redirige sin https ni con los estados del club", () => {
    expect(redirectTarget({ state: "REDIRECT", url: "javascript:alert(1)" })).toBeNull();
    expect(redirectTarget({ state: "REDIRECT", url: "no es una url" })).toBeNull();
    expect(redirectTarget({ state: "PIECE_INACTIVE" })).toBeNull();
    expect(redirectTarget(undefined)).toBeNull();
  });
});

describe("registerScan", () => {
  it("llama una vez a la API con la IP del cliente", async () => {
    const fetchMock = vi.fn(async () => Response.json({ state: "REDIRECT", url: "https://wa.me/5491123456789" }));
    vi.stubGlobal("fetch", fetchMock);

    const url = await registerScan("abc123", headers({ "x-forwarded-for": "203.0.113.7", cookie: "fs_customer=x" }));

    expect(url).toBe("https://wa.me/5491123456789");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [request] = fetchMock.mock.calls[0] as unknown as [Request];
    expect(request.method).toBe("POST");
    expect(new URL(request.url).pathname).toBe("/public/pieces/abc123/scans");
    expect(request.headers.get("x-forwarded-for")).toBe("203.0.113.7");
    expect(request.headers.get("cookie")).toBeNull();
  });

  it("si la API falla, sigue a la página", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("fetch failed"))));
    expect(await registerScan("abc123", headers({}))).toBeNull();
  });

  it("una pieza inexistente sigue a la página", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ code: "NOT_FOUND" }, { status: 404 })));
    expect(await registerScan("nada", headers({}))).toBeNull();
  });
});
