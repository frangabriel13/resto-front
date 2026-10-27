import { NextResponse, type NextRequest } from "next/server";
import { registerScan } from "@/lib/pieces/scan";

// Un escaneo de una pieza con destino externo responde un 302 antes de empezar la página
// (dentro de la página, el redirect llegaría tarde: ya se mandó el 200 con el streaming).
export async function proxy(request: NextRequest) {
  if (request.method !== "GET") return NextResponse.next();
  const code = decodeURIComponent(request.nextUrl.pathname.slice("/p/".length));
  const target = await registerScan(code, request.headers);
  if (!target) return NextResponse.next();
  const response = NextResponse.redirect(target, 302);
  // Sin caché: un cambio de destino aplica en el próximo escaneo.
  response.headers.set("Cache-Control", "no-store");
  return response;
}

// Las navegaciones internas de Next (prefetch, `router.refresh()`, `<Link>`) no son escaneos.
export const config = {
  matcher: [
    {
      source: "/p/:code",
      missing: [
        { type: "header", key: "rsc" },
        { type: "header", key: "next-router-prefetch" },
      ],
    },
  ],
};
