import { describe, expect, it } from "vitest";
import { cardHeadline, cardTitle, carryOverMessage, filledStamps } from "./card";

const progress = (balance: number, stampsRequired = 8) => ({
  balance,
  stampsRequired,
  remaining: Math.max(stampsRequired - balance, 0),
  canRedeem: balance >= stampsRequired,
});

const active = { reward: "Un café", canShowQr: true, ended: false };

describe("cardHeadline", () => {
  it("dice cuántos sellos faltan y cuál es el premio", () => {
    expect(cardHeadline(progress(3), active)).toEqual({ title: "Te faltan 5 sellos", detail: "Premio: Un café." });
    expect(cardHeadline(progress(7), active).title).toBe("Te falta 1 sello");
  });

  it("con la tarjeta completa, lleva al QR para canjear", () => {
    expect(cardHeadline(progress(8), active)).toEqual({
      title: "¡Completaste tu tarjeta!",
      detail: "Mostrá tu QR en la caja y llevate tu premio.",
    });
  });

  it("cuenta los sellos de más para la próxima tarjeta", () => {
    expect(cardHeadline(progress(9), active).detail).toMatch(/Ya tenés 1 sello para la próxima\.$/);
    expect(cardHeadline(progress(11), active).detail).toMatch(/Ya tenés 3 sellos para la próxima\.$/);
  });

  it("sin QR (club finalizado) no lo pide", () => {
    const ended = { reward: "Un café", canShowQr: false, ended: true };
    expect(cardHeadline(progress(3), ended).detail).toBe("El club finalizó: ya no se suman sellos.");
    expect(cardHeadline(progress(8), ended).detail).toBe("Tu premio: Un café.");
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
