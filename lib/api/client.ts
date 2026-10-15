import createClient from "openapi-fetch";
import type { paths } from "./schema";

// Cliente para el navegador (Client Components). Pasa por el proxy `/api` de
// Next, así las cookies de sesión viajan solas y el `Set-Cookie` llega al
// navegador.
export const api = createClient<paths>({ baseUrl: "/api" });
