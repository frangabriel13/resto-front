import { describe, expect, it } from "vitest";
import { clubSummary, phoneEnding, prizeReady } from "./clubs";

const club = (balance: number, status: "ACTIVE" | "PAUSED" | "ENDED" = "ACTIVE", stampsRequired = 8) => ({
  balance,
  stampsRequired,
  canRedeem: balance >= stampsRequired,
  merchant: { status },
});

describe("clubSummary", () => {
  it("cuenta los sellos de la tarjeta", () => {
    expect(clubSummary(club(3))).toBe("3 de 8 sellos");
  });

  it("avisa el premio listo, también con el club pausado", () => {
    expect(clubSummary(club(8))).toBe("¡Premio listo! · Mostrá tu QR");
    expect(clubSummary(club(9, "PAUSED"))).toBe("¡Premio listo! · Mostrá tu QR");
  });

  it("suma el estado del club pausado o finalizado", () => {
    expect(clubSummary(club(2, "PAUSED"))).toBe("2 de 8 sellos · Pausado");
    expect(clubSummary(club(8, "ENDED"))).toBe("8 de 8 sellos · Finalizado");
  });
});

describe("prizeReady", () => {
  it("con el club finalizado ya no hay canje", () => {
    expect(prizeReady(club(8, "ENDED"))).toBe(false);
    expect(prizeReady(club(8))).toBe(true);
  });
});

describe("phoneEnding", () => {
  it("deja los últimos 4 números", () => {
    expect(phoneEnding("+5491123456789")).toBe("6789");
  });
});
