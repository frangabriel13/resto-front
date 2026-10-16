import { describe, expect, it } from "vitest";
import { actionColor, brandStyle, contrastRatio, readableTextColor } from "./colors";

describe("readableTextColor", () => {
  it("usa texto blanco sobre fondos oscuros", () => {
    expect(readableTextColor("#001d67")).toBe("#ffffff");
    expect(readableTextColor("#000000")).toBe("#ffffff");
  });

  it("usa texto oscuro sobre fondos claros", () => {
    expect(readableTextColor("#ffffff")).toBe("#111111");
    expect(readableTextColor("#f7dc6f")).toBe("#111111");
  });

  it("acepta mayúsculas en el hexadecimal", () => {
    expect(readableTextColor("#F7DC6F")).toBe("#111111");
  });
});

describe("brandStyle", () => {
  it("sin colores del comercio, usa los de Clubsy", () => {
    expect(brandStyle({ primaryColor: null, secondaryColor: null })).toMatchObject({
      "--primary": "#001d67",
      "--brand": "#fc5d00",
    });
  });

  it("con un solo color, lo usa también como secundario", () => {
    expect(brandStyle({ primaryColor: "#c0392b", secondaryColor: null })).toMatchObject({
      "--primary": "#c0392b",
      "--brand": "#c0392b",
    });
  });

  it("acompaña cada color con un texto que se lea", () => {
    expect(brandStyle({ primaryColor: "#c0392b", secondaryColor: "#f7dc6f" })).toMatchObject({
      "--primary-foreground": "#ffffff",
      "--brand-foreground": "#111111",
    });
  });
});

describe("contrastRatio", () => {
  it("va de 1 (mismo color) a 21 (blanco y negro)", () => {
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1);
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
  });
});

describe("actionColor", () => {
  it("usa el secundario si se distingue del blanco", () => {
    expect(actionColor("#001d67", "#fc5d00")).toBe("#fc5d00");
  });

  it("con un secundario muy claro, usa el principal (Café Demo: crema y marrón)", () => {
    expect(actionColor("#6f4e37", "#f5e6d3")).toBe("#6f4e37");
  });

  it("si los dos son claros, usa casi negro", () => {
    expect(actionColor("#f7dc6f", "#f5e6d3")).toBe("#111111");
  });
});

describe("brandStyle: botón principal", () => {
  it("expone el color del botón y un texto que se lea", () => {
    expect(brandStyle({ primaryColor: "#6f4e37", secondaryColor: "#f5e6d3" })).toMatchObject({
      "--cta": "#6f4e37",
      "--cta-foreground": "#ffffff",
    });
  });
});
