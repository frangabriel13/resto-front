type IncomingHeaders = { get(name: string): string | null };

// Las llamadas desde el servidor del front llevan las cookies y la IP del
// cliente: sin ella, la API contaría a todos los clientes como uno solo en sus
// límites de intentos. La IP la pone el proxy de Coolify; la API solo confía en
// lo que agregaron sus proxies internos, así que una IP inventada no cambia nada.
export function forwardedHeaders(cookie: string, incoming: IncomingHeaders): Record<string, string> {
  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  const forwardedFor = incoming.get("x-forwarded-for");
  if (forwardedFor) headers["x-forwarded-for"] = forwardedFor;
  return headers;
}
