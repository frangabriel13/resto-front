import { GiftIcon } from "lucide-react";
import { stampColumns } from "@/lib/rewards/layout";
import { stampCount } from "@/lib/text";
import { cn } from "@/lib/utils";

// Con más sellos, los círculos quedarían diminutos: la tarjeta pasa a una tira compacta.
const maxStampsInGrid = 14;

// La tarjeta de sellos como un ticket, con los colores de `brandStyle` (`--ticket*`): llena del color
// del comercio o, si el botón principal ya lo usa, en un tono suave. Arriba lo que corresponda
// (`children`) y, después del corte, los sellos numerados con el premio en el último.
export function StampTicket({
  stampsRequired,
  highlightFirst = false,
  children,
}: {
  stampsRequired: number;
  highlightFirst?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[0.875rem] bg-ticket text-left text-ticket-foreground">
      <div className="px-4.5 pt-4.5 pb-3.5">{children}</div>
      <TicketCut />
      {stampsRequired > maxStampsInGrid ? (
        <CompactStamps stampsRequired={stampsRequired} />
      ) : (
        <StampGrid stampsRequired={stampsRequired} highlightFirst={highlightFirst} />
      )}
    </div>
  );
}

// Antes de sumarse: el premio en grande.
export function StampCardPreview({ stampsRequired, rewardDescription }: { stampsRequired: number; rewardDescription: string }) {
  return (
    <StampTicket stampsRequired={stampsRequired}>
      <p className="text-sm leading-snug text-ticket-foreground/82">
        Con <span className="font-semibold text-ticket-foreground">{stampCount(stampsRequired)}</span> te llevás
      </p>
      <p className="mt-0.5 text-[1.375rem] leading-[1.18] font-semibold tracking-[-0.02em] text-balance wrap-anywhere">
        {rewardDescription}
      </p>
    </StampTicket>
  );
}

function PrizeStamp({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center justify-center rounded-full bg-ticket-prize text-ticket-prize-foreground", className)}>
      <GiftIcon aria-hidden className="size-4.5" />
    </span>
  );
}

function StampGrid({ stampsRequired, highlightFirst }: { stampsRequired: number; highlightFirst: boolean }) {
  return (
    <div
      role="img"
      aria-label={`Tarjeta de ${stampCount(stampsRequired)}`}
      className="grid gap-2 px-4.5 pt-3.5 pb-4.5"
      style={{ gridTemplateColumns: `repeat(${stampColumns(stampsRequired)}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: stampsRequired }, (_, index) => {
        if (index === stampsRequired - 1) return <PrizeStamp key={index} className="aspect-square" />;
        // En la bienvenida, el primero es "el próximo": sumarse no da sellos, así que no se dibuja lleno.
        const next = highlightFirst && index === 0;
        return (
          <span
            key={index}
            className={cn(
              "flex aspect-square items-center justify-center rounded-full border-dashed text-[0.8125rem]",
              next
                ? "border-2 border-ticket-foreground font-semibold text-ticket-foreground motion-safe:animate-stamp-next"
                : "border-[1.5px] border-ticket-foreground/50 font-medium text-ticket-foreground/85",
            )}
          >
            {index + 1}
          </span>
        );
      })}
    </div>
  );
}

function CompactStamps({ stampsRequired }: { stampsRequired: number }) {
  return (
    <div
      role="img"
      aria-label={`Tarjeta de ${stampCount(stampsRequired)}`}
      className="flex items-center gap-3 px-4.5 pt-4 pb-4.5"
    >
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="h-2.5 rounded-full border-[1.5px] border-dashed border-ticket-foreground/50" />
        <span aria-hidden className="text-xs text-ticket-foreground/82">
          0 de {stampCount(stampsRequired)}
        </span>
      </span>
      <PrizeStamp className="size-10 shrink-0" />
    </div>
  );
}

// El corte del ticket: dos medialunas del color de la hoja en los bordes y una línea punteada.
function TicketCut() {
  return (
    <div aria-hidden className="relative flex h-5 items-center">
      <span className="absolute -left-2.5 size-5 rounded-full bg-background" />
      <span className="mx-4.5 flex-1 border-t-[1.5px] border-dashed border-ticket-foreground/35" />
      <span className="absolute -right-2.5 size-5 rounded-full bg-background" />
    </div>
  );
}
