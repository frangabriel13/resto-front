import { describe, expect, it } from "vitest";
import type { PanelMembership } from "@/lib/stamps/types";
import { nextCardText } from "./next-card";

const membership = (balance: number, stampsRequired = 8): PanelMembership => ({
  id: "01a14015-6b7b-75cd-a8b2-1ae5bd684538",
  customer: { name: "Ana", phone: null },
  cycle: 2,
  balance,
  stampsRequired,
  remaining: Math.max(stampsRequired - balance, 0),
  canRedeem: balance >= stampsRequired,
  totalStamps: 8 + balance,
});

describe("nextCardText", () => {
  it("sin sellos de más, arranca vacía", () => {
    expect(nextCardText(membership(0))).toBe("Arranca una tarjeta nueva.");
  });

  it("con sellos de más, arranca con ellos", () => {
    expect(nextCardText(membership(1))).toBe("Arranca una tarjeta nueva con 1 de 8.");
  });

  it("si la regla nueva pide menos y ya la completó, lo avisa", () => {
    expect(nextCardText(membership(3, 3))).toMatch(/ya completó la próxima/);
  });
});
