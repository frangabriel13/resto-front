import { customerRoutes } from "./routes";
import type { ClubPiece } from "./types";

export type PageMenuItem =
  | { kind: "club"; label: string; href: string }
  | { kind: "review"; label: string; url: string }
  | { kind: "wifi"; label: string; href: string };

type Visitor = { isMember: boolean; hasSession: boolean };

// Un socio sin sesión en este celular no se distingue de cualquiera: con el club abierto entra por
// "Sumarse" (el código recupera su cuenta); con el club cerrado, solo le queda ingresar.
function clubItem(piece: ClubPiece, code: string, { isMember, hasSession }: Visitor): PageMenuItem | null {
  const { slug } = piece.merchant;
  if (isMember) return { kind: "club", label: "Ver mi tarjeta", href: customerRoutes.card(slug) };
  if (piece.canJoin) return { kind: "club", label: "Sumarse al club", href: customerRoutes.pieceClub(code) };
  if (hasSession || piece.state === "CLUB_NOT_OPEN") return null;
  return {
    kind: "club",
    label: piece.state === "ENDED" ? "Ver mi historial" : "Ver mi tarjeta",
    href: customerRoutes.login(customerRoutes.card(slug)),
  };
}

// Cada botón aparece solo si corresponde, en este orden.
export function pageMenu(piece: ClubPiece, code: string, visitor: Visitor): PageMenuItem[] {
  const club = clubItem(piece, code, visitor);
  const reviewUrl = piece.merchant.googleReviewUrl;
  return [
    ...(club ? [club] : []),
    ...(reviewUrl ? [{ kind: "review", label: "Dejar una reseña", url: reviewUrl } as const] : []),
    ...(piece.page.wifi
      ? [{ kind: "wifi", label: "Conectarse al Wi-Fi", href: customerRoutes.pieceWifi(code) } as const]
      : []),
  ];
}

export const pageNotices: Partial<Record<ClubPiece["state"], string>> = {
  PAUSED: "El club está pausado: por ahora no se suman sellos ni clientes nuevos.",
  ENDED: "Este club finalizó.",
};

type Wifi = NonNullable<ClubPiece["page"]["wifi"]>;

// Una web no puede conectar el celular sola: los pasos los hace el cliente.
export function wifiSteps({ ssid, password }: Pick<Wifi, "ssid" | "password">): string[] {
  return password
    ? [
        "Copiá la contraseña con el botón de arriba.",
        "Abrí los ajustes de Wi-Fi de tu celular.",
        `Elegí la red “${ssid}” y pegá la contraseña.`,
      ]
    : ["Abrí los ajustes de Wi-Fi de tu celular.", `Elegí la red “${ssid}”: no pide contraseña.`];
}
