import "server-only";
import { cookies } from "next/headers";
import createClient from "openapi-fetch";
import type { paths } from "./schema";

// Los `Set-Cookie` de la API no llegan al navegador: lo que toque la sesión va por `api`.
// Leer las cookies antes de crear el cliente marca el render como de request (`cacheComponents`).
export async function getServerApi() {
  const cookie = (await cookies()).toString();
  return createClient<paths>({
    baseUrl: process.env.API_URL ?? "http://localhost:3001",
    headers: cookie ? { cookie } : undefined,
  });
}
