import { BookOpenIcon, ChevronRightIcon, StarIcon, WifiIcon } from "lucide-react";
import type { PlaceItem } from "@/lib/customer/page-menu";
import { MenuItemLink } from "./menu-item-link";

const icons = { menu: BookOpenIcon, review: StarIcon, wifi: WifiIcon };

// Una opción del local: el ícono en un círculo, el texto con su detalle en gris y el chevron.
export function PlaceRow({ item }: { item: PlaceItem }) {
  const Icon = icons[item.kind];
  return (
    <MenuItemLink
      item={item}
      className="-mx-2 flex min-h-14.5 items-center gap-3 rounded-[0.625rem] px-2 transition-colors outline-none hover:bg-neutral-50 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-neutral-100"
    >
      <span className="flex size-10.5 shrink-0 items-center justify-center rounded-full bg-ink/8 text-ink">
        <Icon aria-hidden strokeWidth={1.6} className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium">{item.label}</span>
        {item.detail && <span className="truncate text-xs text-muted-foreground">{item.detail}</span>}
      </span>
      <ChevronRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
    </MenuItemLink>
  );
}
