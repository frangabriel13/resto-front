import { describe, expect, it } from "vitest";
import { deleteConfirmed, showConsentToggle } from "./privacy";

describe("showConsentToggle", () => {
  it("se ofrece salvo con el club finalizado y sin consentimiento", () => {
    expect(showConsentToggle("ACTIVE", false)).toBe(true);
    expect(showConsentToggle("PAUSED", false)).toBe(true);
    expect(showConsentToggle("ENDED", true)).toBe(true);
    expect(showConsentToggle("ENDED", false)).toBe(false);
  });
});

describe("deleteConfirmed", () => {
  it("pide escribir BORRAR", () => {
    expect(deleteConfirmed("BORRAR")).toBe(true);
    expect(deleteConfirmed(" borrar ")).toBe(true);
    expect(deleteConfirmed("borra")).toBe(false);
    expect(deleteConfirmed("")).toBe(false);
  });
});
