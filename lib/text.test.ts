import { describe, expect, it } from "vitest";
import { initials } from "./text";

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
