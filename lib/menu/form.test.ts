import { describe, expect, it } from "vitest";
import { emptyItemValues, hasVisibleItems, itemSchema, parsePrice, toItemBody, toItemValues } from "./form";
import type { Menu, MenuItem } from "./types";

const item: MenuItem = { id: "i", name: "Café", description: null, price: null, priceFrom: false, visible: true };
const menuWith = (visible: boolean, items: MenuItem[]): Menu => ({
  label: "CARTA",
  categories: [{ id: "c", name: "Bebidas", visible, items }],
});

describe("parsePrice", () => {
  it("acepta pesos enteros, con puntos o signo", () => {
    expect(parsePrice("1500")).toBe(1500);
    expect(parsePrice("1.500")).toBe(1500);
    expect(parsePrice(" $ 25.000 ")).toBe(25000);
  });

  it("rechaza centavos, cero, texto y lo que excede el máximo", () => {
    for (const value of ["1500,50", "0", "gratis", "", "100000000"]) {
      expect(parsePrice(value), value).toBeNull();
    }
  });
});

describe("itemSchema", () => {
  const paths = (values: Partial<typeof emptyItemValues>) => {
    const result = itemSchema.safeParse({ ...emptyItemValues, name: "Café", ...values });
    return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
  };

  it("alcanza con el nombre", () => {
    expect(paths({})).toEqual([]);
    expect(paths({ name: " " })).toEqual(["name"]);
  });

  it("valida los largos y el precio, como la API", () => {
    expect(paths({ name: "x".repeat(81) })).toEqual(["name"]);
    expect(paths({ description: "x".repeat(301) })).toEqual(["description"]);
    expect(paths({ price: "12,5" })).toEqual(["price"]);
    expect(paths({ price: "1.500" })).toEqual([]);
  });
});

describe("toItemBody", () => {
  it("lo vacío se manda como null", () => {
    expect(toItemBody({ ...emptyItemValues, name: "Café" })).toEqual({
      name: "Café",
      description: null,
      price: null,
      priceFrom: false,
    });
  });

  it("convierte el precio y conserva el \"desde\"", () => {
    expect(toItemBody({ name: "Torta", description: "Porción", price: "1.500", priceFrom: true })).toEqual({
      name: "Torta",
      description: "Porción",
      price: 1500,
      priceFrom: true,
    });
  });

  it("sin precio no puede ser \"desde\"", () => {
    expect(toItemBody({ ...emptyItemValues, name: "Café", priceFrom: true }).priceFrom).toBe(false);
  });
});

describe("toItemValues", () => {
  it("carga el ítem en el formulario", () => {
    expect(toItemValues({ ...item, description: "Solo", price: 1500, priceFrom: true })).toEqual({
      name: "Café",
      description: "Solo",
      price: "1500",
      priceFrom: true,
    });
    expect(toItemValues(item)).toMatchObject({ description: "", price: "" });
  });
});

describe("hasVisibleItems", () => {
  it("hace falta un ítem visible en una categoría visible", () => {
    expect(hasVisibleItems(menuWith(true, [item]))).toBe(true);
    expect(hasVisibleItems(menuWith(false, [item]))).toBe(false);
    expect(hasVisibleItems(menuWith(true, [{ ...item, visible: false }]))).toBe(false);
    expect(hasVisibleItems(menuWith(true, []))).toBe(false);
  });
});
