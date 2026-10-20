export const customerRoutes = {
  account: "/cuenta",
  piece: (code: string) => `/p/${encodeURIComponent(code)}`,
  card: (slug: string) => `/c/${encodeURIComponent(slug)}`,
  // Ingresar y volver a `path` (por ejemplo, la tarjeta que quería ver).
  login: (path: string) => `/cuenta?volver=${encodeURIComponent(path)}`,
  // Después de salir de un club o borrar la cuenta (`accountNotice`).
  accountNotice: (notice: AccountNotice) => `/cuenta?aviso=${notice}`,
} as const;

const accountNotices = {
  salida: "Saliste del club. Tus sellos quedan guardados: si volvés a sumarte desde el local, seguís donde estabas.",
  "cuenta-borrada": "Borramos tu cuenta. Si querés volver a usar Clubsy, podés registrarte de nuevo.",
} as const;

export type AccountNotice = keyof typeof accountNotices;

// Solo textos fijos: el aviso nunca muestra lo que venga en la URL.
export function accountNotice(value: unknown): string | null {
  return typeof value === "string" && Object.hasOwn(accountNotices, value)
    ? accountNotices[value as AccountNotice]
    : null;
}

// Solo páginas del propio sitio: evita que `?volver=` mande a otro dominio.
export function safeReturnPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  return value;
}
