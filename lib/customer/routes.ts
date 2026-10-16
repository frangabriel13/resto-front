export const customerRoutes = {
  account: "/cuenta",
  piece: (code: string) => `/p/${encodeURIComponent(code)}`,
  card: (slug: string) => `/c/${encodeURIComponent(slug)}`,
  // Ingresar y volver a `path` (por ejemplo, la tarjeta que quería ver).
  login: (path: string) => `/cuenta?volver=${encodeURIComponent(path)}`,
} as const;

// Solo páginas del propio sitio: evita que `?volver=` mande a otro dominio.
export function safeReturnPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  return value;
}
