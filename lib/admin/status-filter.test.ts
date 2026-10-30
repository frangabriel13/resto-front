import { describe, expect, it } from "vitest";
import { merchantListQuery, parseStatusFilter, statusFilterHref } from "./status-filter";

describe("parseStatusFilter", () => {
  it("lee el filtro de la URL", () => {
    expect(parseStatusFilter("preparacion")).toBe("DRAFT");
    expect(parseStatusFilter("finalizado")).toBe("ENDED");
    expect(parseStatusFilter("archivados")).toBe("ARCHIVED");
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
    expect(statusFilterHref("ARCHIVED")).toBe("/admin?estado=archivados");
    expect(statusFilterHref(null)).toBe("/admin");
  });
});

describe("merchantListQuery", () => {
  it("pide los archivados aparte y los estados sin ellos", () => {
    expect(merchantListQuery("ARCHIVED")).toEqual({ archived: "true" });
    expect(merchantListQuery("ENDED")).toEqual({ status: "ENDED" });
    expect(merchantListQuery(null)).toEqual({});
  });
});
