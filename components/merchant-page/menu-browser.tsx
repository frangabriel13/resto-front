"use client";

import { useRef, useState } from "react";
import { formatPesos } from "@/lib/format";
import { filterMenu, type MenuFilter, productCount } from "@/lib/customer/menu";
import type { ClubPiece } from "@/lib/customer/types";
import { cn } from "@/lib/utils";

type Category = NonNullable<ClubPiece["menu"]>["categories"][number];
type Item = Category["items"][number];

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-4 text-[0.8125rem] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-97",
        active ? "bg-cta text-cta-foreground" : "bg-neutral-100 text-foreground hover:bg-neutral-200",
      )}
    >
      {children}
    </button>
  );
}

function MenuItemRow({ item }: { item: Item }) {
  return (
    <li className="flex items-start gap-4 border-t py-3 first:border-t-0">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium break-words">{item.name}</span>
        {item.description && (
          <span className="text-[0.8125rem] leading-normal break-words text-muted-foreground">{item.description}</span>
        )}
      </div>
      {item.price !== null && (
        <div className="flex shrink-0 flex-col items-end">
          {item.priceFrom && <span className="text-[0.6875rem] text-muted-foreground">desde</span>}
          <span className="text-sm font-semibold whitespace-nowrap">{formatPesos(item.price)}</span>
        </div>
      )}
    </li>
  );
}

export function MenuBrowser({ categories }: { categories: Category[] }) {
  const [filter, setFilter] = useState<MenuFilter>("all");
  const topRef = useRef<HTMLDivElement>(null);

  // Con los filtros fijos arriba y la lista más abajo, al cambiar de categoría vuelve al principio.
  function pick(next: MenuFilter) {
    setFilter(next);
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView();
  }

  return (
    <>
      <div ref={topRef} />
      {categories.length > 1 && (
        <nav
          aria-label="Categorías"
          className="sticky top-0 z-10 -mx-5 mt-2.5 flex gap-2 overflow-x-auto bg-background px-5 py-2.5 [scrollbar-width:none] sm:flex-wrap"
        >
          <FilterPill active={filter === "all"} onClick={() => pick("all")}>
            Todo
          </FilterPill>
          {categories.map((category) => (
            <FilterPill key={category.id} active={filter === category.id} onClick={() => pick(category.id)}>
              {category.name}
            </FilterPill>
          ))}
        </nav>
      )}
      {filterMenu(categories, filter).map((category) => (
        <section key={category.id} aria-labelledby={`categoria-${category.id}`} className="pt-4.5">
          <h2
            id={`categoria-${category.id}`}
            className="mb-1 flex items-baseline justify-between gap-3 text-[1.0625rem] font-semibold"
          >
            <span className="min-w-0 break-words">{category.name}</span>
            <span className="shrink-0 text-xs font-normal text-muted-foreground">
              {productCount(category.items.length)}
            </span>
          </h2>
          <ul>
            {category.items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
