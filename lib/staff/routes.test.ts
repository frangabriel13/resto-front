import { describe, expect, it } from "vitest";
import { isPanelRouteActive, panelRoutes } from "./routes";

describe("isPanelRouteActive", () => {
  it("marca Inicio solo en la raíz del panel", () => {
    expect(isPanelRouteActive("/panel", panelRoutes.home)).toBe(true);
    expect(isPanelRouteActive("/panel/clientes", panelRoutes.home)).toBe(false);
  });

  it("marca la sección también en sus subrutas", () => {
    expect(isPanelRouteActive("/panel/clientes", panelRoutes.customers)).toBe(true);
    expect(isPanelRouteActive("/panel/clientes/123", panelRoutes.customers)).toBe(true);
  });

  it("no confunde secciones que empiezan igual", () => {
    expect(isPanelRouteActive("/panel/clientes-viejos", panelRoutes.customers)).toBe(false);
  });
});
