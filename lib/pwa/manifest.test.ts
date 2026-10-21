import { describe, expect, it } from "vitest";
import { customerApp, panelApp, webManifest } from "./manifest";

describe("webManifest", () => {
  const apps = [customerApp, panelApp].map(webManifest);

  it("cada app abre dentro de su alcance y con un id propio", () => {
    for (const manifest of apps) expect(manifest.start_url?.startsWith(manifest.scope ?? "")).toBe(true);
    expect(new Set(apps.map((manifest) => manifest.id)).size).toBe(apps.length);
  });

  it("el nombre corto entra debajo del ícono", () => {
    for (const manifest of apps) expect(manifest.short_name?.length).toBeLessThanOrEqual(12);
  });

  it("el cliente abre en sus clubes y el panel en el panel", () => {
    expect(webManifest(customerApp).start_url).toBe("/cuenta");
    expect(webManifest(panelApp).start_url).toBe("/panel");
  });

  it("incluye íconos comunes y adaptables de 192 y 512", () => {
    const icons = webManifest(customerApp).icons ?? [];
    for (const purpose of ["any", "maskable"]) {
      expect(icons.filter((icon) => icon.purpose === purpose).map((icon) => icon.sizes)).toEqual(["192x192", "512x512"]);
    }
  });
});
