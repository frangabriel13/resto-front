import { menuTexts } from "./menu";
import { customerRoutes } from "./routes";
import type { ClubPiece, MembershipSummary } from "./types";

// La sección del club en la tarjeta del menú: qué se gana (o cuánto le falta al socio) y un botón.
export type ClubSection = {
  label: string;
  href: string;
  title: string;
  detail: string | null;
  progress: { filled: number; total: number } | null;
};

// Lo demás que ofrece el local, cada uno con una línea chica que dice qué encuentra al tocarlo.
export type PlaceItem = { label: string; detail: string | null } & (
  | { kind: "menu"; href: string }
  | { kind: "review"; url: string }
  | { kind: "wifi"; href: string }
);

export type PageMenu = { club: ClubSection | null; place: PlaceItem[] };

type Visitor = {
  membership: Pick<MembershipSummary, "balance" | "stampsRequired" | "remaining" | "canRedeem"> | null;
  hasSession: boolean;
};

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export function cardTitle({ remaining, canRedeem }: Pick<MembershipSummary, "remaining" | "canRedeem">): string {
  if (canRedeem) return "Tu premio está listo para canjear";
  return `Te ${remaining === 1 ? "falta" : "faltan"} ${plural(remaining, "sello", "sellos")}`;
}

// Las primeras categorías de la carta, como adelanto de lo que hay.
export function menuDetail(categories: { name: string }[]): string | null {
  const names = categories.map((category) => category.name);
  if (names.length === 0) return null;
  if (names.length === 1) return names[0];
  if (names.length <= 3) return `${names.slice(0, -1).join(", ")} y ${names.at(-1)}`;
  return `${names.slice(0, 3).join(", ")} y más`;
}

// Un socio sin sesión en este celular no se distingue de cualquiera: con el club abierto entra por
// "Sumarse" (el código recupera su cuenta); con el club cerrado, solo le queda ingresar.
function clubSection(piece: ClubPiece, code: string, { membership, hasSession }: Visitor): ClubSection | null {
  const { slug } = piece.merchant;
  if (membership) {
    // Los sellos de más (antes de canjear) llenan la barra, pero no la pasan.
    const filled = Math.min(membership.balance, membership.stampsRequired);
    return {
      label: "Ver mi tarjeta",
      href: customerRoutes.card(slug),
      title: cardTitle(membership),
      detail: `Llevás ${membership.balance} de ${plural(membership.stampsRequired, "sello", "sellos")}`,
      progress: { filled, total: membership.stampsRequired },
    };
  }
  if (piece.canJoin) {
    const rule = piece.rewardRule;
    return {
      label: "Sumarse al club",
      href: customerRoutes.pieceClub(code),
      title: rule?.rewardDescription ?? "Juntá sellos y ganá premios",
      detail: rule ? `Con ${plural(rule.stampsRequired, "sello", "sellos")}` : null,
      progress: null,
    };
  }
  if (hasSession || piece.state === "CLUB_NOT_OPEN") return null;
  const ended = piece.state === "ENDED";
  return {
    label: ended ? "Ver mi historial" : "Ver mi tarjeta",
    href: customerRoutes.login(customerRoutes.card(slug)),
    title: "¿Ya sos socio?",
    detail: `Ingresá con tu celular para ver ${ended ? "tu historial" : "tu tarjeta"}`,
    progress: null,
  };
}

// El club va primero; después la carta, la reseña y el Wi-Fi, cada uno solo si está cargado.
export function pageMenu(piece: ClubPiece, code: string, visitor: Visitor): PageMenu {
  const reviewUrl = piece.merchant.googleReviewUrl;
  const { menu } = piece;
  const { wifi } = piece.page;
  const place: (PlaceItem | null)[] = [
    menu && {
      kind: "menu",
      label: menuTexts[menu.label].button,
      detail: menuDetail(menu.categories),
      href: customerRoutes.pieceMenu(code),
    },
    reviewUrl ? { kind: "review", label: "Dejar una reseña", detail: "En Google", url: reviewUrl } : null,
    wifi && { kind: "wifi", label: "Conectarse al Wi-Fi", detail: `Red ${wifi.ssid}`, href: customerRoutes.pieceWifi(code) },
  ];
  return { club: clubSection(piece, code, visitor), place: place.filter((item) => item !== null) };
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
