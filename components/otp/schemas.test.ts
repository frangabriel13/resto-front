import { describe, expect, it } from "vitest";
import { codeSchema, normalizeCode } from "./schemas";

describe("código por WhatsApp", () => {
  it("acepta el código pegado con espacio o guión", () => {
    expect(normalizeCode("123 456")).toBe("123456");
    expect(normalizeCode(" 123-456 ")).toBe("123456");
    expect(codeSchema.safeParse({ code: "123 456" }).success).toBe(true);
  });

  it("rechaza lo que no son 6 números", () => {
    expect(codeSchema.safeParse({ code: "12345" }).success).toBe(false);
    expect(codeSchema.safeParse({ code: "12a456" }).success).toBe(false);
  });
});
