import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

// "Volver" en un círculo blanco, sobre la franja del color del comercio.
// Se ve de 40 px; la zona de toque (`after`) llega a 44.
export const roundBackClass =
  "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_4px_12px_rgb(0_0_0/0.15)] outline-none after:absolute after:-inset-0.5 after:rounded-full after:content-[''] focus-visible:ring-3 focus-visible:ring-ring/50";

export function RoundBackIcon() {
  return <ChevronLeftIcon aria-hidden className="size-4.5" />;
}

export function RoundBackLink({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Volver" className={roundBackClass}>
      <RoundBackIcon />
    </Link>
  );
}
