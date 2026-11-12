import Link from "next/link";
import type { PlaceItem } from "@/lib/customer/page-menu";

// La reseña abre Google en otra pestaña; el resto son pantallas propias.
export function MenuItemLink({
  item,
  className,
  children,
}: {
  item: PlaceItem;
  className: string;
  children: React.ReactNode;
}) {
  if (item.kind === "review") {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {children}
    </Link>
  );
}
