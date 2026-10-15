import "server-only";
import { cookies } from "next/headers";
import createClient from "openapi-fetch";
import type { paths } from "./schema";

// Cliente para Server Components y Server Functions. Va directo a la API (sin
// el proxy) con las cookies de la request entrante. Los `Set-Cookie` que
// responda la API no llegan al navegador.
//
// Se arma por request: leer las cookies primero marca el render como de
// request, como pide `cacheComponents`.
export async function getServerApi() {
  const cookie = (await cookies()).toString();
  return createClient<paths>({
    baseUrl: process.env.API_URL ?? "http://localhost:3001",
    headers: cookie ? { cookie } : undefined,
  });
}
