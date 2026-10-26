import { NextResponse, type NextRequest } from "next/server";

// Intercepta /p/:code ANTES de la página: si la pieza tiene un destino
// propio (no CLUBSY), corta camino con un 307 real de servidor -con
// Location-, sin pasar por el landing del club ni depender de JS. Si la
// API no contesta a tiempo, o la pieza es del club de siempre, deja pasar
// a app/p/[code]/page.tsx tal cual estaba.
const API_URL = process.env.API_URL ?? "http://localhost:3001";
const VISIT_TIMEOUT_MS = 2500;

type PieceVisit = { redirect: boolean; url?: string };

function isHttpsUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("https://");
}

export async function proxy(request: NextRequest) {
  const code = request.nextUrl.pathname.slice("/p/".length);
  if (!code || code.includes("/")) return NextResponse.next();

  const forwardedFor = request.headers.get("x-forwarded-for");
  try {
    const res = await fetch(`${API_URL}/public/pieces/${encodeURIComponent(code)}/visit`, {
      headers: forwardedFor ? { "x-forwarded-for": forwardedFor } : {},
      signal: AbortSignal.timeout(VISIT_TIMEOUT_MS),
    });
    if (!res.ok) return NextResponse.next();

    const visit = (await res.json()) as PieceVisit;
    // Nunca redirige a un valor sin validar, aunque la API ya solo guarde
    // https: es la última barrera antes de mandar al visitante a otro lado.
    if (visit.redirect && isHttpsUrl(visit.url)) {
      return NextResponse.redirect(visit.url, 307);
    }
  } catch {
    // Timeout, API caída, JSON inválido: nunca es motivo para no dejar
    // pasar al flujo de siempre (que a su vez maneja el error como ya lo hacía).
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/p/:code",
};
