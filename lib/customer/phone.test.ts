import { describe, expect, it } from "vitest";
import { looksLikePhone } from "./phone";

describe("looksLikePhone", () => {
  it("acepta los formatos con que la gente escribe su celular", () => {
    expect(looksLikePhone("11 2345 6789")).toBe(true);
    expect(looksLikePhone("011 15-2345-6789")).toBe(true);
    expect(looksLikePhone("+54 9 11 2345-6789")).toBe(true);
    expect(looksLikePhone("(351) 555-1234")).toBe(true);
  });

  it("rechaza letras y números demasiado cortos o largos", () => {
    expect(looksLikePhone("11 2345 abcd")).toBe(false);
    expect(looksLikePhone("1234567")).toBe(false);
    expect(looksLikePhone("1234567890123456")).toBe(false);
    expect(looksLikePhone("")).toBe(false);
  });
});
