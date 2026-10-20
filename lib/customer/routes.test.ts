import { describe, expect, it } from "vitest";
import { accountNotice, customerRoutes, safeReturnPath } from "./routes";

describe("safeReturnPath", () => {
  it("acepta rutas del propio sitio", () => {
    expect(safeReturnPath("/c/cafe-demo")).toBe("/c/cafe-demo");
    expect(safeReturnPath("/cuenta")).toBe("/cuenta");
  });

  it("rechaza otros dominios, protocolos y valores raros", () => {
    expect(safeReturnPath("https://malo.com")).toBeNull();
    expect(safeReturnPath("//malo.com")).toBeNull();
    expect(safeReturnPath("/\\malo.com")).toBeNull();
    expect(safeReturnPath("javascript:alert(1)")).toBeNull();
    expect(safeReturnPath("c/cafe-demo")).toBeNull();
    expect(safeReturnPath(["/c/a", "/c/b"])).toBeNull();
    expect(safeReturnPath(undefined)).toBeNull();
  });

  it("deja volver a la dirección que arma customerRoutes.login", () => {
    const url = new URL(customerRoutes.login("/c/café demo"), "https://clubsy.app");
    expect(safeReturnPath(url.searchParams.get("volver"))).toBe("/c/café demo");
  });
});

describe("accountNotice", () => {
  it("solo avisos conocidos", () => {
    expect(accountNotice("salida")).toMatch(/Saliste del club/);
    expect(accountNotice("cuenta-borrada")).toMatch(/Borramos tu cuenta/);
    expect(accountNotice("<script>")).toBeNull();
    expect(accountNotice("toString")).toBeNull();
    expect(accountNotice(["salida"])).toBeNull();
  });
});
