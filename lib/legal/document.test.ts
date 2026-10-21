import { describe, expect, it } from "vitest";
import { missingEntityFields } from "./document";

describe("missingEntityFields", () => {
  it("lista lo que falta completar", () => {
    expect(missingEntityFields({ name: "FullSync S.A.S.", cuit: null, address: "", email: "hola@x.com" })).toEqual([
      "CUIT",
      "domicilio legal",
    ]);
  });

  it("no lista nada con todo completo", () => {
    expect(missingEntityFields({ name: "a", cuit: "b", address: "c", email: "d" })).toEqual([]);
  });
});
