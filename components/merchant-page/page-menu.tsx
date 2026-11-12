import type { PageMenu as PageMenuData } from "@/lib/customer/page-menu";
import { ClubSection } from "./club-section";
import { PlaceRow } from "./place-row";

export function PageMenu({ menu }: { menu: PageMenuData }) {
  const { club, place } = menu;
  if (!club && place.length === 0) return null;
  return (
    <nav aria-label="Menú del comercio" className="flex flex-col">
      {club && <ClubSection club={club} />}
      {club && place.length > 0 && <div className="mt-4.5 mb-1 h-px bg-border" />}
      {place.length > 0 && (
        <section aria-labelledby="en-el-local" className="flex flex-col">
          <h2 id="en-el-local" className="mt-2.5 mb-1 text-base font-semibold">
            En el local
          </h2>
          {place.map((item) => (
            <PlaceRow key={item.kind} item={item} />
          ))}
        </section>
      )}
    </nav>
  );
}
