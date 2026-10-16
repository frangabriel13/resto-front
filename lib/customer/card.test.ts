import { describe, expect, it } from "vitest";
import { filledStamps, progressMessage } from "./card";

const progress = (balance: number, stampsRequired = 8) => ({
  balance,
  stampsRequired,
  remaining: Math.max(stampsRequired - balance, 0),
  canRedeem: balance >= stampsRequired,
});

describe("progressMessage", () => {
  it("dice cuántos sellos faltan", () => {
    expect(progressMessage(progress(3))).toBe("Te faltan 5 sellos para tu premio.");
    expect(progressMessage(progress(0))).toBe("Te faltan 8 sellos para tu premio.");
  });

  it("usa singular cuando falta uno", () => {
    expect(progressMessage(progress(7))).toBe("Te falta 1 sello para tu premio.");
  });

  it("avisa que completó la tarjeta", () => {
    expect(progressMessage(progress(8))).toBe(
      "¡Completaste tu tarjeta! Pedile al local que te canjee el premio.",
    );
  });

  it("cuenta los sellos de más para la próxima tarjeta", () => {
    expect(progressMessage(progress(9))).toMatch(/Ya tenés 1 sello para la próxima\.$/);
    expect(progressMessage(progress(11))).toMatch(/Ya tenés 3 sellos para la próxima\.$/);
  });
});

describe("filledStamps", () => {
  it("llena tantos casilleros como sellos, sin pasarse de la tarjeta", () => {
    expect(filledStamps(progress(3))).toBe(3);
    expect(filledStamps(progress(11))).toBe(8);
  });
});
