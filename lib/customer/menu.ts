import { formatPesos } from "@/lib/format";
import type { ClubPiece } from "./types";

type PublicMenu = NonNullable<ClubPiece["menu"]>;
type MenuItem = PublicMenu["categories"][number]["items"][number];

// El nombre del botón lo elige el comercio; el título de la pantalla lo acompaña.
export const menuTexts: Record<PublicMenu["label"], { button: string; title: string }> = {
  CARTA: { button: "Ver la carta", title: "La carta" },
  MENU: { button: "Ver el menú", title: "El menú" },
  SERVICES: { button: "Ver servicios", title: "Servicios" },
  PRODUCTS: { button: "Ver productos", title: "Productos" },
  PRICE_LIST: { button: "Lista de precios", title: "Lista de precios" },
};

export function menuItemPrice({ price, priceFrom }: Pick<MenuItem, "price" | "priceFrom">): string | null {
  if (price === null) return null;
  return priceFrom ? `Desde ${formatPesos(price)}` : formatPesos(price);
}
