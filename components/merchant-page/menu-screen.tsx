import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { Button } from "@/components/ui/button";
import { menuItemPrice, menuTexts } from "@/lib/customer/menu";
import { customerRoutes } from "@/lib/customer/routes";
import type { ClubPiece } from "@/lib/customer/types";

type PublicMenu = NonNullable<ClubPiece["menu"]>;

const anchor = (id: string) => `categoria-${id}`;

export function MenuScreen({ menu, pieceCode }: { menu: PublicMenu; pieceCode: string }) {
  const back = customerRoutes.piece(pieceCode);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <BackLink href={back}>Volver</BackLink>
        <h2 className="font-heading text-xl font-semibold">{menuTexts[menu.label].title}</h2>
      </div>

      {menu.categories.length > 1 && (
        <nav
          aria-label="Categorías"
          className="sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto bg-background px-4 py-2"
        >
          {menu.categories.map((category) => (
            <Button key={category.id} asChild variant="outline" size="sm" className="h-9 shrink-0 rounded-full">
              <a href={`#${anchor(category.id)}`}>{category.name}</a>
            </Button>
          ))}
        </nav>
      )}

      {menu.categories.map((category) => (
        // El margen deja el título a la vista debajo del índice fijo.
        <section key={category.id} id={anchor(category.id)} className="flex scroll-mt-16 flex-col gap-3">
          <h3 className="font-heading text-lg font-semibold break-words text-primary">{category.name}</h3>
          <ul className="flex flex-col divide-y">
            {category.items.map((item) => {
              const price = menuItemPrice(item);
              return (
                <li key={item.id} className="flex flex-col gap-1 py-3 first:pt-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="min-w-0 font-medium break-words">{item.name}</span>
                    {price && <span className="shrink-0 font-medium whitespace-nowrap">{price}</span>}
                  </div>
                  {item.description && (
                    <p className="text-sm break-words text-muted-foreground">{item.description}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <Button asChild variant="outline" className="h-11 w-full">
        <Link href={back}>
          <ChevronLeftIcon />
          Volver
        </Link>
      </Button>
    </div>
  );
}
