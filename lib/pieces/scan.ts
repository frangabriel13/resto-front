import createClient from "openapi-fetch";
import { forwardedHeaders } from "@/lib/api/forwarded-headers";
import type { components, paths } from "@/lib/api/schema";

type PublicPiece = components["schemas"]["PublicPiece"];
type IncomingHeaders = { get(name: string): string | null };

// Si la API tarda, el escaneo sigue a la página (que pide la pieza de nuevo) en vez de colgarse.
const scanTimeoutMs = 3000;

// Solo se redirige a destinos https, aunque la API ya arma las URLs.
export function redirectTarget(piece: PublicPiece | undefined): string | null {
  if (piece?.state !== "REDIRECT") return null;
  try {
    return new URL(piece.url).protocol === "https:" ? piece.url : null;
  } catch {
    return null;
  }
}

// Registra el escaneo y devuelve la URL externa, o `null` si la pieza muestra la página del club.
export async function registerScan(code: string, incoming: IncomingHeaders): Promise<string | null> {
  const api = createClient<paths>({
    baseUrl: process.env.API_URL ?? "http://localhost:3001",
    headers: forwardedHeaders("", incoming),
  });
  try {
    const { data } = await api.POST("/public/pieces/{code}/scans", {
      params: { path: { code } },
      signal: AbortSignal.timeout(scanTimeoutMs),
    });
    return redirectTarget(data);
  } catch {
    return null;
  }
}
