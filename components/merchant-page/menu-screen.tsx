import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { brandStyle } from "@/lib/brand/colors";
import { menuTexts } from "@/lib/customer/menu";
import { customerRoutes } from "@/lib/customer/routes";
import type { ClubPiece } from "@/lib/customer/types";
import { MenuBrowser } from "./menu-browser";

type MenuScreenProps = {
  merchant: ClubPiece["merchant"];
  menu: NonNullable<ClubPiece["menu"]>;
  pieceCode: string;
};

// La franja del color del comercio con "volver" y, encima, una hoja blanca con la carta. Sin logo,
// nombre ni pie: es una pantalla de consulta que se abre desde la página del comercio.
export function MenuScreen({ merchant, menu, pieceCode }: MenuScreenProps) {
  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-primary">
      <div className="px-4 pt-4 pb-4">
        <Link
          href={customerRoutes.piece(pieceCode)}
          aria-label="Volver"
          className="flex size-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_4px_12px_rgb(0_0_0/0.15)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronLeftIcon aria-hidden className="size-4.5" />
        </Link>
      </div>
      <div className="flex-1 rounded-t-[1.625rem] bg-background px-5 pt-5 pb-8">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{menuTexts[menu.label].title}</h1>
          <MenuBrowser categories={menu.categories} />
        </div>
      </div>
    </main>
  );
}
