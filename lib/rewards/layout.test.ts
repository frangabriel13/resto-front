import { describe, expect, it } from "vitest";
import { stampColumns } from "./layout";

describe("stampColumns", () => {
  it("hasta 7 sellos, una sola fila", () => {
    expect(stampColumns(1)).toBe(1);
    expect(stampColumns(6)).toBe(6);
    expect(stampColumns(7)).toBe(7);
  });

  it("reparte en filas parejas", () => {
    expect(stampColumns(8)).toBe(4);
    expect(stampColumns(10)).toBe(5);
    expect(stampColumns(12)).toBe(6);
    expect(stampColumns(15)).toBe(5);
  });

  it("nunca pasa de 7 por fila", () => {
    expect(stampColumns(20)).toBe(7);
    expect(stampColumns(50)).toBe(7);
  });
});
