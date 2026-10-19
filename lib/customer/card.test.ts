import { describe, expect, it } from "vitest";
import { cardTitle, carryOverMessage, filledStamps, progressMessage } from "./card";

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
    expect(progressMessage(progress(8))).toBe("¡Completaste tu tarjeta!");
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

describe("cardTitle", () => {
  it("numera la tarjeta desde la segunda", () => {
    expect(cardTitle(1)).toBe("Tu tarjeta");
    expect(cardTitle(3)).toBe("Tarjeta n.º 3");
  });
});

describe("carryOverMessage", () => {
  it("explica los sellos que pasaron de la tarjeta anterior", () => {
    expect(carryOverMessage({ cycle: 2, carryOver: 1 })).toBe(
      "Arrancaste con 1 sello que te sobró de la tarjeta anterior.",
    );
    expect(carryOverMessage({ cycle: 2, carryOver: 2 })).toBe(
      "Arrancaste con 2 sellos que te sobraron de la tarjeta anterior.",
    );
  });

  it("nada si no sobraron sellos o es la primera tarjeta", () => {
    expect(carryOverMessage({ cycle: 2, carryOver: 0 })).toBeNull();
    expect(carryOverMessage({ cycle: 1, carryOver: 0 })).toBeNull();
  });
});
