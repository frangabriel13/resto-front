import { describe, expect, it } from "vitest";
import { parseStatusFilter, statusFilterHref } from "./status-filter";

describe("parseStatusFilter", () => {
  it("lee el estado de la URL", () => {
    expect(parseStatusFilter("preparacion")).toBe("DRAFT");
    expect(parseStatusFilter("finalizado")).toBe("ENDED");
  });

  it("sin filtro o con uno desconocido muestra todos", () => {
    expect(parseStatusFilter(undefined)).toBeNull();
    expect(parseStatusFilter("ACTIVE")).toBeNull();
    expect(parseStatusFilter(["activo", "pausado"])).toBeNull();
  });
});

describe("statusFilterHref", () => {
  it("arma el link de cada filtro", () => {
    expect(statusFilterHref("PAUSED")).toBe("/admin?estado=pausado");
    expect(statusFilterHref(null)).toBe("/admin");
  });
});
