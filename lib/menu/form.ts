import { z } from "zod";
import { orNull } from "@/lib/merchants/fields";
import type { Menu, MenuItem, NewItemBody } from "./types";

const maxPrice = 99_999_999;

const menuName = z.string().trim().min(1, "Ingresá el nombre.").max(80, "Hasta 80 caracteres.");

// Pesos enteros; se acepta "1.500" o "$ 1500", como lo escribiría cualquiera.
export function parsePrice(value: string): number | null {
  const digits = value.replace(/[$.\s]/g, "");
  if (!/^\d+$/.test(digits)) return null;
  const price = Number(digits);
  return price >= 1 && price <= maxPrice ? price : null;
}

export const categorySchema = z.object({ name: menuName });
export type CategoryValues = z.infer<typeof categorySchema>;

export const itemSchema = z.object({
  name: menuName,
  description: z.string().trim().max(300, "Hasta 300 caracteres."),
  price: z
    .string()
    .trim()
    .refine((value) => value === "" || parsePrice(value) !== null, "Ingresá un precio en pesos, sin centavos."),
  priceFrom: z.boolean(),
});
export type ItemValues = z.infer<typeof itemSchema>;

export const emptyItemValues: ItemValues = { name: "", description: "", price: "", priceFrom: false };

export function toItemValues(item: MenuItem): ItemValues {
  return {
    name: item.name,
    description: item.description ?? "",
    price: item.price === null ? "" : String(item.price),
    priceFrom: item.priceFrom,
  };
}

// "Desde" sin precio lo rechaza la API: se saca junto con el precio.
export function toItemBody(values: ItemValues): NewItemBody {
  const price = values.price ? parsePrice(values.price) : null;
  return {
    name: values.name,
    description: orNull(values.description),
    price,
    priceFrom: price !== null && values.priceFrom,
  };
}

// El botón de la carta aparece en la página solo si hay algo para ver.
export function hasVisibleItems(menu: Menu): boolean {
  return menu.categories.some((category) => category.visible && category.items.some((item) => item.visible));
}
