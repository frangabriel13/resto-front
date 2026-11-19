import { describe, expect, it } from "vitest";
import { filterMenu, menuItemPrice } from "./menu";

// El formato de moneda usa un espacio duro después del signo.
const normalize = (text: string | null) => text?.replace(/\s/g, " ");

describe("menuItemPrice", () => {
  it("muestra pesos enteros con separador de miles", () => {
    expect(normalize(menuItemPrice({ price: 1500, priceFrom: false }))).toBe("$ 1.500");
    expect(normalize(menuItemPrice({ price: 0, priceFrom: false }))).toBe("$ 0");
  });

  it("marca el precio \"desde\"", () => {
    expect(normalize(menuItemPrice({ price: 25000, priceFrom: true }))).toBe("Desde $ 25.000");
  });

  it("sin precio no muestra nada", () => {
    expect(menuItemPrice({ price: null, priceFrom: false })).toBeNull();
  });
});

describe("filterMenu", () => {
  const categories = [{ id: "cafe" }, { id: "pasteleria" }, { id: "bebidas" }];

  it("con «Todo» muestra todas las categorías", () => {
    expect(filterMenu(categories, "all")).toEqual(categories);
  });

  it("con una categoría muestra solo esa", () => {
    expect(filterMenu(categories, "pasteleria")).toEqual([{ id: "pasteleria" }]);
  });

  it("si la categoría ya no está, vuelve a mostrar todas", () => {
    expect(filterMenu(categories, "salado")).toEqual(categories);
  });
});
