import { describe, expect, it } from "vitest";
import {
  archiveWarning,
  canArchive,
  confirmsName,
  deleteBlockedReason,
  deletePiecesWarning,
  deletionItems,
  hasCustomersMessage,
  type DeletionSummary,
} from "./archive";

const empty: DeletionSummary = {
  archived: false,
  canDelete: true,
  customers: 0,
  stamps: 0,
  redemptions: 0,
  pieces: 0,
  customerAccounts: 0,
  staffUsers: 0,
};

describe("canArchive", () => {
  it("solo en preparación o finalizado", () => {
    expect(canArchive("DRAFT")).toBe(true);
    expect(canArchive("ENDED")).toBe(true);
    expect(canArchive("ACTIVE")).toBe(false);
    expect(canArchive("PAUSED")).toBe(false);
  });
});

describe("confirmsName", () => {
  it("ignora mayúsculas y espacios en los extremos", () => {
    expect(confirmsName("  café ÑANDÚ ", "Café Ñandú")).toBe(true);
  });

  it("no acepta otro nombre ni vacío", () => {
    expect(confirmsName("Cafe Ñandú", "Café Ñandú")).toBe(false);
    expect(confirmsName("Café", "Café Ñandú")).toBe(false);
    expect(confirmsName("  ", " ")).toBe(false);
  });
});

describe("deletePiecesWarning", () => {
  it("singular y plural", () => {
    expect(deletePiecesWarning(1)).toMatch(/^Tiene 1 pieza: deja de funcionar\. .*sacale la contraseña al chip/);
    expect(deletePiecesWarning(3)).toMatch(/^Tiene 3 piezas: dejan de funcionar\. .*sacales la contraseña a los chips/);
  });
});

describe("archiveWarning", () => {
  it("avisa cuántas piezas dejan de funcionar", () => {
    expect(archiveWarning(0)).not.toMatch(/pieza/);
    expect(archiveWarning(1)).toMatch(/Su pieza activa se desactiva y deja de funcionar/);
    expect(archiveWarning(3)).toMatch(/Sus 3 piezas activas se desactivan/);
  });
});

describe("hasCustomersMessage", () => {
  it("usa la cantidad que manda la API", () => {
    expect(hasCustomersMessage({ customers: 1 })).toBe("Tiene 1 cliente: para borrarlo, primero archivalo.");
    expect(hasCustomersMessage({ customers: 12 })).toMatch(/^Tiene 12 clientes:/);
  });

  it("sin la cantidad, igual explica", () => {
    expect(hasCustomersMessage(undefined)).toMatch(/^Tiene o tuvo clientes:/);
  });
});

describe("deleteBlockedReason", () => {
  it("se puede borrar si la API lo permite", () => {
    expect(deleteBlockedReason(empty, "ACTIVE")).toBeNull();
    expect(deleteBlockedReason({ ...empty, customers: 3, archived: true }, "ENDED")).toBeNull();
  });

  it("con clientes, pide archivarlo (y antes finalizarlo si está abierto)", () => {
    const blocked = { ...empty, customers: 3, canDelete: false };
    expect(deleteBlockedReason(blocked, "ENDED")).toBe("Tiene 3 clientes: para borrarlo, primero archivalo.");
    expect(deleteBlockedReason(blocked, "ACTIVE")).toBe(
      "Tiene 3 clientes: para borrarlo, primero finalizá el club y archivalo.",
    );
  });
});

describe("deletionItems", () => {
  it("sin nada más que la ficha", () => {
    expect(deletionItems(empty)).toEqual(["La ficha, la marca, el premio y el historial del comercio"]);
  });

  it("lista solo lo que tiene, en singular y plural", () => {
    const items = deletionItems({
      ...empty,
      customers: 1,
      stamps: 12,
      redemptions: 1,
      customerAccounts: 1,
      pieces: 2,
      staffUsers: 3,
    });
    expect(items.slice(1)).toEqual([
      "1 cliente del club, con 12 sellos y 1 canje",
      "1 cuenta de cliente que no está en otro club: se borra como si la borrara el cliente",
      "2 piezas",
      "3 usuarios del panel que no están en otro comercio",
    ]);
  });
});
