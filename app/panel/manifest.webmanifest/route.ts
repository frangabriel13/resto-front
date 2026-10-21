import { manifestResponse, panelApp } from "@/lib/pwa/manifest";

export function GET() {
  return manifestResponse(panelApp);
}
