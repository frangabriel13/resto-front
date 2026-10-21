import type { Metadata } from "next";
import { panelApp } from "@/lib/pwa/manifest";

// Instalado desde el panel, el acceso abre en el panel y no en la cuenta del cliente.
export const metadata: Metadata = {
  manifest: panelApp.manifestUrl,
  appleWebApp: { title: panelApp.shortName },
};

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return children;
}
