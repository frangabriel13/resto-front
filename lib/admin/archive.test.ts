import { describe, expect, it } from "vitest";
import { archiveWarning, canArchive, confirmsName, deletePiecesWarning, hasCustomersMessage } from "./archive";

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
    expect(hasCustomersMessage({ customers: 1 })).toMatch(/^Tiene 1 cliente: no se puede borrar/);
    expect(hasCustomersMessage({ customers: 12 })).toMatch(/^Tiene 12 clientes:/);
  });

  it("sin la cantidad, igual explica", () => {
    expect(hasCustomersMessage(undefined)).toMatch(/^Tiene o tuvo clientes:/);
  });
});
