import { describe, expect, it } from "vitest";
import { pageMenu, wifiSteps } from "./page-menu";
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

const guest = { isMember: false, hasSession: false };
const customer = { isMember: false, hasSession: true };
const member = { isMember: true, hasSession: true };
const labels = (...args: Parameters<typeof pageMenu>) => pageMenu(...args).map((item) => item.label);

describe("pageMenu", () => {
  it("con el club activo ofrece sumarse, y al socio su tarjeta", () => {
    expect(pageMenu(piece(), "abc", guest)).toEqual([
      { kind: "club", label: "Sumarse al club", href: "/p/abc/club" },
    ]);
    expect(pageMenu(piece(), "abc", member)).toEqual([
      { kind: "club", label: "Ver mi tarjeta", href: "/c/cafe" },
    ]);
  });

  it("en preparación no hay nada del club", () => {
    expect(labels(piece({ state: "CLUB_NOT_OPEN", canJoin: false }), "abc", guest)).toEqual([]);
  });

  it("con el club cerrado no ofrece sumarse: sin sesión, ingresar para ver lo suyo", () => {
    const paused = piece({ state: "PAUSED", canJoin: false });
    const ended = piece({ state: "ENDED", canJoin: false });
    expect(pageMenu(paused, "abc", guest)).toEqual([
      { kind: "club", label: "Ver mi tarjeta", href: "/cuenta?volver=%2Fc%2Fcafe" },
    ]);
    expect(labels(ended, "abc", guest)).toEqual(["Ver mi historial"]);
    expect(labels(paused, "abc", customer)).toEqual([]);
    expect(labels(ended, "abc", member)).toEqual(["Ver mi tarjeta"]);
  });

  it("la reseña y el Wi-Fi solo si están cargados, en cualquier estado y después del club", () => {
    const full = piece(
      { state: "CLUB_NOT_OPEN", canJoin: false, page: { wifi, socials: [] } as ClubPiece["page"] },
      { googleReviewUrl: "https://g.page/r/x/review" },
    );
    expect(pageMenu(full, "abc", guest)).toEqual([
      { kind: "review", label: "Dejar una reseña", url: "https://g.page/r/x/review" },
      { kind: "wifi", label: "Conectarse al Wi-Fi", href: "/p/abc/wifi" },
    ]);
    expect(labels({ ...full, state: "ACTIVE", canJoin: true }, "abc", guest)[0]).toBe("Sumarse al club");
  });
});

describe("pageMenu: carta", () => {
  const menu = { label: "SERVICES", categories: [] } as unknown as ClubPiece["menu"];

  it("va con su nombre, después del club y antes de la reseña", () => {
    const full = piece({ menu }, { googleReviewUrl: "https://g.page/r/x/review" });
    expect(pageMenu(full, "abc", guest)).toEqual([
      { kind: "club", label: "Sumarse al club", href: "/p/abc/club" },
      { kind: "menu", label: "Ver servicios", href: "/p/abc/carta" },
      { kind: "review", label: "Dejar una reseña", url: "https://g.page/r/x/review" },
    ]);
  });

  it("sale en cualquier estado del club", () => {
    expect(labels(piece({ state: "CLUB_NOT_OPEN", canJoin: false, menu }), "abc", guest)).toEqual(["Ver servicios"]);
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
