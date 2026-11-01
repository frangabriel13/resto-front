import { describe, expect, it } from "vitest";
import { emptyPageValues, pageSchema, toPageBody, toPageValues, type PageValues } from "./page";

const wifi = (values: Partial<PageValues["wifi"]>) => ({
  ...emptyPageValues,
  wifi: { ...emptyPageValues.wifi, ...values },
});
const errorPaths = (values: PageValues) => {
  const result = pageSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};

describe("pageSchema", () => {
  it("todo es opcional", () => {
    expect(errorPaths(emptyPageValues)).toEqual([]);
  });

  it("valida la contraseña según la seguridad, como la API", () => {
    expect(errorPaths(wifi({ ssid: "Café", password: "corta" }))).toEqual(["wifi.password"]);
    expect(errorPaths(wifi({ ssid: "Café", password: "clave1234" }))).toEqual([]);
    expect(errorPaths(wifi({ ssid: "Café", security: "WEP", password: "12345" }))).toEqual([]);
    expect(errorPaths(wifi({ ssid: "Café", security: "WEP", password: "1234" }))).toEqual(["wifi.password"]);
    expect(errorPaths(wifi({ ssid: "Café", security: "NONE", password: "lo que quedó" }))).toEqual([]);
  });

  it("una contraseña sin red pide el nombre", () => {
    expect(errorPaths(wifi({ password: "clave1234" }))).toEqual(["wifi.ssid"]);
    expect(errorPaths(wifi({ ssid: "x".repeat(33), password: "clave1234" }))).toEqual(["wifi.ssid"]);
  });

  it("valida las redes", () => {
    const socials = (values: Partial<PageValues>) => errorPaths({ ...emptyPageValues, ...values });
    expect(socials({ instagramUsername: "@cafe.de_la_esquina", tiktokUsername: "@cafe" })).toEqual([]);
    expect(socials({ instagramUsername: "cafe esquina" })).toEqual(["instagramUsername"]);
    expect(socials({ tiktokUsername: "a" })).toEqual(["tiktokUsername"]);
    expect(socials({ whatsappPhone: "hola" })).toEqual(["whatsappPhone"]);
    expect(socials({ facebookUrl: "https://www.facebook.com/cafe" })).toEqual([]);
    expect(socials({ facebookUrl: "https://facebook.com.evil.com/cafe" })).toEqual(["facebookUrl"]);
    expect(socials({ facebookUrl: "http://facebook.com/cafe" })).toEqual(["facebookUrl"]);
  });
});

describe("toPageBody", () => {
  it("lo vacío borra", () => {
    expect(toPageBody(emptyPageValues)).toEqual({
      wifi: null,
      instagramUsername: null,
      tiktokUsername: null,
      whatsappPhone: null,
      facebookUrl: null,
    });
  });

  it("una red abierta va sin contraseña, aunque haya quedado escrita", () => {
    expect(toPageBody(wifi({ ssid: "Café", security: "NONE", password: "vieja" })).wifi).toEqual({
      security: "NONE",
      ssid: "Café",
    });
    expect(toPageBody(wifi({ ssid: "Café", password: "clave1234" })).wifi).toEqual({
      security: "WPA",
      ssid: "Café",
      password: "clave1234",
    });
  });
});

describe("toPageValues", () => {
  it("sin datos arranca vacío y la red abierta queda sin contraseña", () => {
    const empty = { coverUrl: null, wifi: null, instagramUsername: null, tiktokUsername: null, whatsappPhone: null, facebookUrl: null };
    expect(toPageValues(empty)).toEqual(emptyPageValues);
    expect(toPageValues({ ...empty, wifi: { ssid: "Café", security: "NONE", password: null } }).wifi).toEqual({
      ssid: "Café",
      security: "NONE",
      password: "",
    });
  });
});
