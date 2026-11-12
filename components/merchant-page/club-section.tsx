import { GiftIcon } from "lucide-react";
import Link from "next/link";
import type { ClubSection as ClubSectionData } from "@/lib/customer/page-menu";
import { cn } from "@/lib/utils";

function StampBar({ filled, total }: { filled: number; total: number }) {
  return (
    <div role="img" aria-label={`${filled} de ${total} sellos`} className="mt-3.5 flex gap-1.5">
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={cn("h-2 flex-1 rounded-full", index < filled ? "bg-cta" : "bg-neutral-200")} />
      ))}
    </div>
  );
}

export function ClubSection({ club }: { club: ClubSectionData }) {
  return (
    <section aria-labelledby="club-de-premios" className="flex flex-col">
      <h2 id="club-de-premios" className="mb-3 text-base font-semibold">
        Club de premios
      </h2>
      <div className="flex items-center gap-3">
        <span className="flex size-10.5 shrink-0 items-center justify-center rounded-full bg-ink/8 text-ink">
          <GiftIcon aria-hidden strokeWidth={1.6} className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <p className="text-sm font-medium break-words">{club.title}</p>
          {club.detail && <p className="text-[0.8125rem] text-muted-foreground">{club.detail}</p>}
        </div>
      </div>
      {club.progress && <StampBar {...club.progress} />}
      <Link
        href={club.href}
        className="mt-4 flex h-12.5 items-center justify-center rounded-[0.625rem] bg-cta text-[0.9375rem] font-medium text-cta-foreground transition outline-none hover:bg-cta/90 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]"
      >
        {club.label}
      </Link>
    </section>
  );
}
