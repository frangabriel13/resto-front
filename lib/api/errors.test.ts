import { describe, expect, it } from "vitest";
import { validationIssues, type ApiError } from "./errors";

const error = (overrides: Partial<ApiError>): ApiError => ({
  statusCode: 400,
  code: "VALIDATION_ERROR",
  message: "Los datos enviados no son válidos.",
  ...overrides,
});

describe("validationIssues", () => {
  it("devuelve el detalle por campo de un error de validación", () => {
    const issues = [{ path: "phone", message: "Ingresá un celular argentino válido." }];
    expect(validationIssues(error({ details: { issues } }))).toEqual(issues);
  });

  it("descarta entradas con otra forma", () => {
    expect(validationIssues(error({ details: { issues: [{ path: 1 }, "x", null] } }))).toEqual([]);
  });

  it("no devuelve nada para otros errores o sin error", () => {
    expect(validationIssues(error({ code: "CONFLICT", details: { issues: [] } }))).toEqual([]);
    expect(validationIssues(undefined)).toEqual([]);
  });
});
