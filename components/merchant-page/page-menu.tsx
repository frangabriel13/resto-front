import { StarIcon, TicketIcon, WifiIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PageMenuItem } from "@/lib/customer/page-menu";

const icons = { club: TicketIcon, review: StarIcon, wifi: WifiIcon };

export function PageMenu({ items }: { items: PageMenuItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Menú del comercio" className="flex flex-col gap-3">
      {items.map((item) => {
        const Icon = icons[item.kind];
        const content = (
          <>
            <Icon />
            {item.label}
          </>
        );
        // Lo primero del menú se destaca, sea lo que sea que tiene cargado el comercio.
        const primary = item === items[0];
        return (
          <Button
            key={item.kind}
            asChild
            variant={primary ? "default" : "outline"}
            className={primary ? "h-12 w-full bg-cta text-base text-cta-foreground hover:bg-cta/90" : "h-12 w-full text-base"}
          >
            {item.kind === "review" ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link href={item.href}>{content}</Link>
            )}
          </Button>
        );
      })}
    </nav>
  );
}
