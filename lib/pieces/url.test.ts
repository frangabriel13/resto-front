import { describe, expect, it } from "vitest";
import { pieceUrl } from "./url";

describe("pieceUrl", () => {
  it("arma la URL de entrada de la pieza", () => {
    expect(pieceUrl("https://clubsy.app", "Ab3xY9")).toBe("https://clubsy.app/p/Ab3xY9");
  });

  it("no duplica la barra si el sitio termina en /", () => {
    expect(pieceUrl("https://clubsy.app/", "Ab3xY9")).toBe("https://clubsy.app/p/Ab3xY9");
  });

  it("escapa caracteres que no van en una URL", () => {
    expect(pieceUrl("https://clubsy.app", "a b")).toBe("https://clubsy.app/p/a%20b");
  });
});
