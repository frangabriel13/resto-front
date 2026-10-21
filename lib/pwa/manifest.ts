import type { MetadataRoute } from "next";
import { customerRoutes } from "@/lib/customer/routes";
import { panelRoutes } from "@/lib/staff/routes";

type InstallableApp = {
  manifestUrl: string;
  name: string;
  // Lo que se lee debajo del ícono: hasta 12 caracteres para que no se corte.
  shortName: string;
  description: string;
  startUrl: string;
  scope: string;
};

// Dos apps instalables: la del cliente abre en sus clubes y la del panel, en el panel.
export const customerApp: InstallableApp = {
  manifestUrl: "/manifest.webmanifest",
  name: "Clubsy",
  shortName: "Clubsy",
  description: "Tu tarjeta de sellos digital",
  startUrl: customerRoutes.account,
  scope: "/",
};

export const panelApp: InstallableApp = {
  manifestUrl: "/panel/manifest.webmanifest",
  name: "Clubsy · Panel del comercio",
  shortName: "Panel Clubsy",
  description: "Sellos, canjes y clientes de tu comercio",
  startUrl: panelRoutes.home,
  scope: panelRoutes.home,
};

export function webManifest(app: InstallableApp): MetadataRoute.Manifest {
  return {
    id: app.startUrl,
    name: app.name,
    short_name: app.shortName,
    description: app.description,
    lang: "es-AR",
    start_url: app.startUrl,
    scope: app.scope,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Con margen: Android los recorta en círculo u otras formas.
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

export function manifestResponse(app: InstallableApp): Response {
  return Response.json(webManifest(app), { headers: { "Content-Type": "application/manifest+json" } });
}
