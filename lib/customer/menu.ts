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

// "Todo" o el id de una categoría: los filtros de la carta muestran una sola categoría a la vez.
export type MenuFilter = "all" | string;

export function filterMenu<T extends { id: string }>(categories: T[], filter: MenuFilter): T[] {
  if (filter === "all") return categories;
  const match = categories.filter((category) => category.id === filter);
  // Si la categoría ya no está (la ocultaron con la pantalla abierta), se ve la carta entera.
  return match.length > 0 ? match : categories;
}

export function productCount(count: number): string {
  return count === 1 ? "1 producto" : `${count} productos`;
}
