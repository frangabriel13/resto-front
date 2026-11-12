import { describe, expect, it } from "vitest";
import { cardTitle, menuDetail, pageMenu, wifiSteps } from "./page-menu";
import type { ClubPiece } from "./types";

const wifi = { ssid: "Café", password: "clave1234", security: "WPA", qrPayload: "WIFI:T:WPA;S:Café;P:clave1234;;" };

function piece(overrides: Partial<ClubPiece> = {}, merchant: Partial<ClubPiece["merchant"]> = {}): ClubPiece {
  return {
    state: "ACTIVE",
    canJoin: true,
    merchant: {
      id: "1",
      name: "Café",
      slug: "cafe",
      logoUrl: null,
      coverUrl: null,
      primaryColor: null,
      secondaryColor: null,
      googleReviewUrl: null,
      ...merchant,
    },
    page: { wifi: null, socials: [] },
    menu: null,
    rewardRule: null,
    ...overrides,
  } as ClubPiece;
}

const guest = { membership: null, hasSession: false };
const customer = { membership: null, hasSession: true };
const membership = { balance: 5, stampsRequired: 8, remaining: 3, canRedeem: false };
const member = { membership, hasSession: true };
const rule = { stampsRequired: 8, rewardDescription: "Un café gratis", conditions: null };
const clubLabel = (...args: Parameters<typeof pageMenu>) => pageMenu(...args).club?.label ?? null;

describe("pageMenu: club", () => {
  it("con el club activo ofrece sumarse y muestra el premio", () => {
    expect(pageMenu(piece({ rewardRule: rule }), "abc", guest).club).toEqual({
      label: "Sumarse al club",
      href: "/p/abc/club",
      title: "Un café gratis",
      detail: "Con 8 sellos",
      progress: null,
    });
  });

  it("al socio le muestra cuánto le falta, con la barra de sellos", () => {
    expect(pageMenu(piece(), "abc", member).club).toEqual({
      label: "Ver mi tarjeta",
      href: "/c/cafe",
      title: "Te faltan 3 sellos",
      detail: "Llevás 5 de 8 sellos",
      progress: { filled: 5, total: 8 },
    });
  });

  it("los sellos de más llenan la barra sin pasarla", () => {
    const full = { membership: { balance: 9, stampsRequired: 8, remaining: 0, canRedeem: true }, hasSession: true };
    expect(pageMenu(piece(), "abc", full).club?.progress).toEqual({ filled: 8, total: 8 });
  });

  it("en preparación no hay nada del club", () => {
    expect(pageMenu(piece({ state: "CLUB_NOT_OPEN", canJoin: false }), "abc", guest).club).toBeNull();
  });

  it("con el club cerrado no ofrece sumarse: sin sesión, ingresar para ver lo suyo", () => {
    const paused = piece({ state: "PAUSED", canJoin: false });
    const ended = piece({ state: "ENDED", canJoin: false });
    expect(pageMenu(paused, "abc", guest).club).toEqual({
      label: "Ver mi tarjeta",
      href: "/cuenta?volver=%2Fc%2Fcafe",
      title: "¿Ya sos socio?",
      detail: "Ingresá con tu celular para ver tu tarjeta",
      progress: null,
    });
    expect(clubLabel(ended, "abc", guest)).toBe("Ver mi historial");
    expect(clubLabel(paused, "abc", customer)).toBeNull();
    expect(clubLabel(ended, "abc", member)).toBe("Ver mi tarjeta");
  });
});

describe("pageMenu: el local", () => {
  const menu = { label: "SERVICES", categories: [{ name: "Cortes" }, { name: "Color" }] } as unknown as ClubPiece["menu"];

  it("la carta, la reseña y el Wi-Fi, en ese orden y solo si están cargados, en cualquier estado", () => {
    const full = piece(
      { state: "CLUB_NOT_OPEN", canJoin: false, menu, page: { wifi, socials: [] } as ClubPiece["page"] },
      { googleReviewUrl: "https://g.page/r/x/review" },
    );
    expect(pageMenu(full, "abc", guest).place).toEqual([
      { kind: "menu", label: "Ver servicios", detail: "Cortes y Color", href: "/p/abc/carta" },
      { kind: "review", label: "Dejar una reseña", detail: "En Google", url: "https://g.page/r/x/review" },
      { kind: "wifi", label: "Conectarse al Wi-Fi", detail: "Red Café", href: "/p/abc/wifi" },
    ]);
    expect(pageMenu(piece(), "abc", guest).place).toEqual([]);
  });
});

describe("cardTitle", () => {
  it("dice cuántos sellos faltan, en singular o plural", () => {
    expect(cardTitle({ remaining: 1, canRedeem: false })).toBe("Te falta 1 sello");
    expect(cardTitle({ remaining: 5, canRedeem: false })).toBe("Te faltan 5 sellos");
  });

  it("con la tarjeta completa, avisa que el premio está listo", () => {
    expect(cardTitle({ remaining: 0, canRedeem: true })).toBe("Tu premio está listo para canjear");
  });
});

describe("menuDetail", () => {
  const categories = (...names: string[]) => names.map((name) => ({ name }));

  it("nombra hasta tres categorías y, si hay más, suma \"y más\"", () => {
    expect(menuDetail(categories("Cafés"))).toBe("Cafés");
    expect(menuDetail(categories("Cafés", "Pastelería", "Sandwiches"))).toBe("Cafés, Pastelería y Sandwiches");
    expect(menuDetail(categories("Cafés", "Pastelería", "Sandwiches", "Jugos"))).toBe("Cafés, Pastelería, Sandwiches y más");
  });

  it("sin categorías no hay detalle", () => {
    expect(menuDetail([])).toBeNull();
  });
});

describe("wifiSteps", () => {
  it("con contraseña, copiarla y pegarla", () => {
    expect(wifiSteps({ ssid: "Café", password: "clave1234" })).toHaveLength(3);
    expect(wifiSteps({ ssid: "Café", password: "clave1234" })[2]).toContain("“Café”");
  });

  it("una red abierta no pide contraseña", () => {
    const steps = wifiSteps({ ssid: "Café", password: null });
    expect(steps).toHaveLength(2);
    expect(steps[1]).toContain("no pide contraseña");
  });
});
