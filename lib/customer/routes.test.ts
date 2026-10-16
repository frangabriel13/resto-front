import { describe, expect, it } from "vitest";
import { customerRoutes, safeReturnPath } from "./routes";

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
