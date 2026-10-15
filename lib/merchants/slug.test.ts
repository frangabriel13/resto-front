import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("pasa a minúsculas y une las palabras con guiones", () => {
    expect(slugify("Café de la Esquina")).toBe("cafe-de-la-esquina");
  });

  it("saca tildes y eñes", () => {
    expect(slugify("Panadería Ñandú")).toBe("panaderia-nandu");
  });

  it("reemplaza símbolos y evita guiones repetidos o en los bordes", () => {
    expect(slugify("  [PRUEBA]  Helados & Co.  ")).toBe("prueba-helados-co");
  });

  it("corta en 60 caracteres sin dejar un guion al final", () => {
    const slug = slugify(`${"a".repeat(59)} b`);
    expect(slug).toBe("a".repeat(59));
  });
});
