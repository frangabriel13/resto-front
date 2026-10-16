import { describe, expect, it } from "vitest";
import { searchMode } from "./search";

describe("searchMode", () => {
  it("no busca con menos de 2 caracteres", () => {
    expect(searchMode("")).toBe("too-short");
    expect(searchMode(" a ")).toBe("too-short");
  });

  it("con 3 dígitos o más busca por teléfono", () => {
    expect(searchMode("4321")).toBe("phone");
    expect(searchMode("11 2345")).toBe("phone");
  });

  it("si no, por nombre", () => {
    expect(searchMode("Ana")).toBe("name");
    expect(searchMode("Ana 12")).toBe("name");
  });
});
