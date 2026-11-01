import { describe, expect, it } from "vitest";
import { menuItemPrice } from "./menu";

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
