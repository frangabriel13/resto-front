import { describe, expect, it } from "vitest";
import { initials, stampCount } from "./text";

describe("initials", () => {
  it("usa la inicial de las dos primeras palabras", () => {
    expect(initials("Ana Gómez Pérez")).toBe("AG");
  });

  it("con una sola palabra, usa una inicial", () => {
    expect(initials("Dueño")).toBe("D");
  });

  it("ignora prefijos entre corchetes como [DEMO]", () => {
    expect(initials("[DEMO] Bruno Díaz")).toBe("BD");
  });

  it("respeta letras con tilde", () => {
    expect(initials("ángel úbeda")).toBe("ÁÚ");
  });

  it("devuelve vacío si no hay letras", () => {
    expect(initials("  ")).toBe("");
  });
});

describe("stampCount", () => {
  it("singular y plural", () => {
    expect(stampCount(1)).toBe("1 sello");
    expect(stampCount(0)).toBe("0 sellos");
    expect(stampCount(8)).toBe("8 sellos");
  });
});
