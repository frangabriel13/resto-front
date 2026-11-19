import { ChevronRightIcon, StarIcon } from "lucide-react";

// Visible para todos, sin condicionarlo a ninguna valoración ni dar nada a cambio (regla 8).
export function ReviewRow({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-2 flex min-h-14.5 items-center gap-3 rounded-[0.625rem] px-2 transition-colors outline-none hover:bg-neutral-50 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-neutral-100"
    >
      <span className="flex size-10.5 shrink-0 items-center justify-center rounded-full bg-ink/8 text-ink">
        <StarIcon aria-hidden strokeWidth={1.6} className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium">Dejar una reseña</span>
        <span className="text-xs text-muted-foreground">En Google</span>
      </span>
      <ChevronRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
    </a>
  );
}
