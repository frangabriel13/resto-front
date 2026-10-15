import "server-only";

// Dominio público: es el que queda grabado en el chip NFC y en el QR de cada pieza.
export function siteUrl(): string {
  return process.env.PUBLIC_SITE_URL ?? "http://localhost:3002";
}
